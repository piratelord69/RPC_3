import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from "lucide-react";

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");
    setErrorMessage("");

    // Basic validation
    if (!formData.name.trim()) {
      setFormStatus("error");
      setErrorMessage("Please enter your name.");
      return;
    }
    if (
      !formData.email.trim() ||
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      setFormStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!formData.message.trim()) {
      setFormStatus("error");
      setErrorMessage("Please enter your message.");
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // fake API
      setFormStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setFormStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-2xl mx-auto">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          disabled={formStatus === "submitting"}
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={formStatus === "submitting"}
        />
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className="mt-1 w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          disabled={formStatus === "submitting"}
        />
      </div>
      <Button type="submit" className="w-full" disabled={formStatus === "submitting"}>
        {formStatus === "submitting" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>

      <AnimatePresence>
        {formStatus === "success" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
          >
            <CheckCircle className="inline mr-2 h-5 w-5" />
            Message sent successfully!
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {formStatus === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          >
            <AlertTriangle className="inline mr-2 h-5 w-5" />
            {errorMessage}
            <button
              onClick={() => setFormStatus("idle")}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              type="button"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
};
