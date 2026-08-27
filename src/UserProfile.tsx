import React, { useState } from "react";
import DOMPurify from "dompurify";

// --- Fixed version: all six issues from the original file remediated ---

// 1. FIXED: no hardcoded secret. Read from environment/config at runtime,
// injected by your deployment platform (e.g. Vercel env vars), never
// committed to source.
const API_KEY = process.env.NEXT_PUBLIC_STRIPE_KEY ?? "";

interface UserProfileProps {
  userId: string;
  bio: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ userId, bio }) => {
  const [query, setQuery] = useState("");

  // 2. FIXED: sanitize HTML before rendering, instead of trusting it raw.
  const renderBio = () => {
    return { __html: DOMPurify.sanitize(bio) };
  };

  // 3. FIXED: no manual string concatenation into a query. In a real app,
  // this would be a parameterized query via your DB client, e.g.:
  //   db.query("SELECT * FROM users WHERE id = $1", [id])
  // Shown here as a safe placeholder since this component has no real DB.
  const buildUserQuery = (id: string) => {
    return { text: "SELECT * FROM users WHERE id = $1", values: [id] };
  };

  // 4. FIXED: removed eval() entirely. Replaced with a safe, explicit
  // whitelist of supported filter operations instead of arbitrary
  // code execution.
  const runDynamicFilter = (expression: string) => {
    const allowedFilters: Record<string, (q: string) => boolean> = {
      startsWith: (q) => userId.startsWith(q),
      contains: (q) => userId.includes(q),
    };
    return allowedFilters[expression]?.(query) ?? false;
  };

  // 5. FIXED: use a cryptographically secure random source instead of
  // Math.random() for anything security-sensitive like session tokens.
  const generateSessionToken = () => {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  };

  // 6. FIXED: validate/allowlist the URL's host before fetching, instead
  // of blindly fetching any user-supplied URL (prevents SSRF).
  const ALLOWED_AVATAR_HOSTS = ["avatars.example.com"];
  const fetchRemoteAvatar = async (url: string) => {
    const parsed = new URL(url);
    if (!ALLOWED_AVATAR_HOSTS.includes(parsed.host)) {
      throw new Error("Avatar host not allowed");
    }
    const response = await fetch(parsed.toString());
    return response.blob();
  };

  return (
    <div>
      <h2>User Profile: {userId}</h2>
      <div dangerouslySetInnerHTML={renderBio()} />
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <button onClick={() => console.log(buildUserQuery(query))}>
        Search
      </button>
      <button onClick={() => runDynamicFilter(query)}>Run Filter</button>
      <p>Session: {generateSessionToken()}</p>
    </div>
  );
};

export default UserProfile;
