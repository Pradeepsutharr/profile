// pages/admin/login.jsx
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/router";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  // NEW: validation state
  const [errors, setErrors] = useState({});
  const router = useRouter();

  // NEW: email validator
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    let errs = {};

    if (!email.trim()) {
      errs.email = "Email is required";
    } else if (!validateEmail(email)) {
      errs.email = "Enter a valid email address";
    }

    if (!pw.trim()) {
      errs.pw = "Password is required";
    } else if (pw.length < 6) {
      errs.pw = "Password must be at least 6 characters";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    // validate before making API call
    if (!validateForm()) return;

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pw,
      });

      if (error) {
        alert(error.message);
        return;
      }

      if (!data?.user) {
        alert("Login failed, no user returned.");
        return;
      }

      const user = data.user;

      const { data: adminData, error: adminErr } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", user.id)
        .single();

      if (adminErr && adminErr.code !== "PGRST116") {
        alert("Error checking admin status");
        await supabase.auth.signOut();
        return;
      }

      if (!adminData) {
        alert("You are not an admin");
        await supabase.auth.signOut();
        return;
      }

      router.push("/admin");
    } catch (err) {
      alert("Unexpected error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 lg:py-16 grid place-items-center">
      <form
        onSubmit={handleSignIn}
        className="gredient-jet p-8 rounded-xl border border-stroke flex flex-col gap-y-5 w-full max-w-[450px]"
      >
        {/* EMAIL FIELD */}
        <div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className={`py-2 text-main w-full px-3 rounded-lg bg-transparent border ${
              errors.email ? "border-red-500" : "border-stroke"
            } bg-[#323335] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* PASSWORD FIELD */}
        <div className="relative">
          <input
            type={showPw ? "text" : "password"}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Password"
            className={`py-2 text-main w-full px-3 rounded-lg bg-transparent border ${
              errors.pw ? "border-red-500" : "border-stroke"
            } bg-[#323335] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary`}
          />

          <button
            type="button"
            onClick={() => setShowPw((prev) => !prev)}
            className="text-subtle absolute top-3 right-3"
          >
            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>

          {errors.pw && (
            <p className="text-red-500 text-sm mt-1">{errors.pw}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="block bg-primary py-2 rounded-full mt-8 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Signing..." : "Sign in"}
        </button>
      </form>
    </section>
  );
}
