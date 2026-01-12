"use client"

import { useRef } from "react"
import Link from "next/link"
import { MessageSquare } from "lucide-react"
import { motion, useInView } from "framer-motion"

export function Footer() {
  const footerRef = useRef<HTMLElement>(null)
  const isInView = useInView(footerRef, { once: true, margin: "-50px" })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  }

  const navLinks = [
    { href: "/chat", label: "Chat" },
    { href: "/login", label: "Login" },
    { href: "/admin", label: "Admin" },
  ]

  return (
    <footer ref={footerRef} className="border-t bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-center gap-4"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Logo */}
          <motion.div variants={itemVariants}>
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div whileHover={{ scale: 1.1, rotate: 10 }} transition={{ duration: 0.3 }}>
                <MessageSquare className="h-5 w-5 text-primary" />
              </motion.div>
              <span className="font-semibold">
                Campus<span className="text-primary">AI</span>
              </span>
            </Link>
          </motion.div>

          {/* Links */}
          <motion.nav className="flex items-center gap-6 text-sm text-muted-foreground" variants={itemVariants}>
            {navLinks.map((link) => (
              <motion.div
                key={link.href}
                whileHover={{ y: -2, color: "var(--foreground)" }}
                transition={{ duration: 0.2 }}
              >
                <Link href={link.href} className="hover:text-foreground transition-colors">
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.nav>

          {/* Attribution */}
          <motion.p className="text-sm text-muted-foreground" variants={itemVariants}>
            Built for Smart India Hackathon 2025
          </motion.p>
        </motion.div>
      </div>
    </footer>
  )
}
