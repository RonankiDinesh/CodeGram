import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios"
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";

export default function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    githubUsername: "",
    bio: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.email.includes("@")) {
      newErrors.email = "Invalid email address";
    }
    
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const res = axios.post("http://localhost:8000/api/auth/register",formData,{withCredentials:true})  
    dispatch(setUser(res.data.user))  
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Branding */}
      <div className="hidden md:flex md:w-1/2 bg-card border-r border-border flex-col items-center justify-center p-12">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold mb-4">CodeGram</h1>
          <p className="text-xl text-muted-foreground">
            Share your code. Build in public.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile branding */}
          <div className="md:hidden text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">CodeGram</h1>
            <p className="text-muted-foreground">Share your code. Build in public.</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required
                  className="bg-background"
                />
              </div>

              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="bg-background"
                />
                {errors.email && (
                  <p className="text-xs text-destructive-foreground mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  className="bg-background"
                />
                {errors.password && (
                  <p className="text-xs text-destructive-foreground mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  required
                  className="bg-background"
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive-foreground mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div>
                <Input
                  type="text"
                  placeholder="GitHub Username"
                  value={formData.githubUsername}
                  onChange={(e) =>
                    setFormData({ ...formData, githubUsername: e.target.value })
                  }
                  required
                  className="bg-background"
                />
              </div>

              <div>
                <Textarea
                  placeholder="Short Bio"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  className="bg-background resize-none"
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full">
                Register
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-foreground font-semibold hover:opacity-60 transition-opacity"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
