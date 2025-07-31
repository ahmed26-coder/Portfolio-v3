"use client"

import { useTranslations } from 'next-intl';
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Github, Linkedin, Mail, Send } from "lucide-react"
import { submitContactForm } from "./contact.action"

export default function ContactSection() {
    const t = useTranslations('ContactPage');
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    })
    const [isLoading, setIsLoading] = useState(false)
    const [isPending, startTransition] = useTransition()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target

        if (name === "phone") {
            const cleaned = value.replace(/[^\d+]/g, "")
            const formatted = cleaned.startsWith("+")
                ? "+" + cleaned.slice(1).replace(/\+/g, "")
                : cleaned.replace(/\+/g, "")

            setFormData(prev => ({ ...prev, phone: formatted }))
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const nameRegex = /^[a-zA-Z\u0600-\u06FF]{2,}(?: [a-zA-Z\u0600-\u06FF]{2,})+$/
        const phoneRegex = /^\+?\d{7,15}$/

        if (!nameRegex.test(formData.name.trim())) {
            toast.error(t('nameRegex'))
            return
        }

        if (!phoneRegex.test(formData.phone.trim())) {
            toast.error(t('phoneRegex'))
            return
        }

        setIsLoading(true)

        startTransition(() => {
            submitContactForm(formData).then((res) => {
                setIsLoading(false)
                if (res.success) {
                    toast.success(t('success'))
                    setFormData({ name: "", email: "", phone: "", message: "" })
                } else {
                    toast.error(t('error'))
                }
            })
        })
    }

    return (
        <section id="contact">
            <div className="relative mx-auto max-w-7xl transition-colors duration-300">
                <div className="z-10 px-4 flex items-center justify-center sm:flex-none sm:items-start sm:justify-start">
                    <div className="mx-auto">
                        <div className="rounded-2xl sm:p-4 lg:gap-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-5 text-start sm:space-y-8">
                                    <h1 className="text-4xl  font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                                        {t('let')}
                                    </h1>
                                    <p className="text-xl font-medium">
                                        {t('disc')}
                                    </p>

                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-4">
                                            <Mail className="w-6 h-6 text-blue-500" />
                                            <a
                                                href="mailto:ahmedadhem330@gmail.com"
                                                target="_blank"
                                                className="hover:text-blue-500 text-lg font-medium transition-colors"
                                            >
                                                ahmedadhem330@gmail.com
                                            </a>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <Github className="w-6 h-6 text-blue-500" />
                                            <a
                                                href="https://github.com/ahmed26-coder"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-blue-500 text-lg font-medium transition-colors"
                                            >
                                                github.com
                                            </a>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <Linkedin className="w-6 h-6 text-blue-500" />
                                            <a
                                                href="https://www.linkedin.com/in/ahmed-adham-479334331"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-blue-500 text-lg font-medium transition-colors"
                                            >
                                                linkedin.com
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium mb-1">
                                                {t('name')}
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                placeholder={t('titlename')}
                                                onChange={handleChange}
                                                disabled={isLoading || isPending}
                                                className="w-full px-4 py-2 rounded-lg border bg-gray-100 dark:bg-black/30 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 outline-none transition-colors"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium mb-1">
                                                {t('email')}
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                placeholder={t('titleemail')}
                                                onChange={handleChange}
                                                disabled={isLoading || isPending}
                                                className="w-full px-4 py-2 rounded-lg border bg-gray-100 dark:bg-black/30 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 outline-none transition-colors"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium mb-1">
                                            {t('phone')}
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            placeholder={t('titlephone')}
                                            onChange={handleChange}
                                            disabled={isLoading || isPending}
                                            pattern="[0-9+]*"
                                            inputMode="numeric"
                                            className="w-full px-4 py-2 rounded-lg border bg-gray-100 dark:bg-black/30 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 outline-none transition-colors"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium mb-1">
                                            {t('Message')}
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            placeholder={t('titleMessage')}
                                            onChange={handleChange}
                                            disabled={isLoading || isPending}
                                            rows={8}
                                            className="w-full px-4 py-2 rounded-lg border bg-gray-100 dark:bg-black/30 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 outline-none transition-colors"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        aria-label="Send Message"
                                        className={`w-full flex items-center justify-center space-x-2 px-6 py-2 text-white rounded-lg transition-opacity ${isLoading || isPending
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90"
                                            }`}
                                        disabled={isLoading || isPending}
                                    >
                                        {isLoading || isPending ? (
                                            <svg
                                                className="animate-spin h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 000 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                                                ></path>
                                            </svg>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                <span>{t('button')}</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
