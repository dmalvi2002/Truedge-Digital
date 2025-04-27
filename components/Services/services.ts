// data/services.ts
export interface ServiceData {
  id: number;
  title: string;
  description: string;
  gifUrl: string;
  points: string[];
  modals?: ServiceModel[];
}

export interface ServiceModel {
  id: number;
  title: string;
  pricing?: string; // Optional, only for some modals
  features: string[];
  highlight?: boolean;
}

export const services: ServiceData[] = [
  {
    id: 1,
    title: "Website Design & Development",
    description:
      "We create stunning, responsive websites that drive results for your business. Our expert team combines cutting-edge technologies with creative design to deliver exceptional online experiences tailored to your brand.",
    gifUrl: "/images/service1.gif", // Replace with actual path in your project
    points: [
      "Professional UI/UX Design with FIGMA",
      "High Quality Animation",
      "Powerful Functionality & Software Integration",
      "SEO-based Design & Development",
      "Mobile Friendly Interface",
      "Content Management Enabled (CMS)",
      "Social Media Integration",
      "Front End & Back End Support/Integration",
      "Security Protection (SSL Certificate)",
      "Web Hosting",
      "Ultra Blazing Fast Website",
      "Technical Support 365 - Maintenance & Backup",
    ],
    modals: [
      {
        id: 101,
        title: "1 Page Website",
        pricing: "450£",
        features: [
          "1 Page Website",
          "Includes Contact Page",
          "Professional UI/UX Design",
          "SEO based Design & Development",
          "Ultra Blazing Fast Website",
          "High Quality Animation",
          "Mobile Friendly",
          "Security Protection (SSL Certificate)",
          "Web Hosting Setup",
          "Delivery in 10 days",
        ],
      },
      {
        id: 102,
        title: "Business Essential",
        pricing: "975£",
        features: [
          "Up to 6 Page Website",
          "Includes BLOG Page & Testimonial & Gallery Page",
          "Professional UI/UX Design",
          "SEO based design & Development",
          "Ultra Blazing Fast Website",
          "High Quality Animation",
          "Mobile Friendly",
          "Front End & Back End Support/Integration",
          "Security Protection (SSL Certificate)",
          "Web Hosting Setup",
          "Social Media Integration",
          "Customer Support 365",
          "Delivery in 25 days",
        ],
        highlight: true,
      },
      {
        id: 103,
        title: "Business Professional",
        pricing: "1,450£",
        features: [
          "Fully Customised 10+ Page Website",
          "Includes Everything from Business Essential",
          "Third Party Software / API Integration",
          "Powerful Functionality",
          "Full backend/CMS integration without any limitations",
          "1 year free premium Hosting",
          "Full SEO Services for 3 months (On page SEO, Off page SEO, Backlinks, Speed, Schema, Technical Fixes)",
          "Logo & Full Brand Identity Package (Logo, Business Card, Letterhead, Email Signature)",
          "VIP Customer Support",
          "Delivery in 25 days",
        ],
      },
    ],
  },
  {
    id: 2,
    title: "SEO & Digital Marketing",
    description:
      "Boost your online visibility and drive targeted traffic with our comprehensive SEO and digital marketing solutions. Our data-driven strategies help you connect with your audience, increase brand awareness, and achieve measurable business growth.",
    gifUrl: "/images/service2.gif", // Replace with actual path in your project
    points: [
      "Free Website Audit & SEO Audit",
      "On-page SEO Optimization",
      "Off-page SEO & Link Building",
      "Technical SEO & Site Speed Optimization",
      "Content Strategy & Creation",
      "Local SEO & Google Business Profile Optimization",
      "Social Media Marketing & Management",
      "Email Marketing Campaigns",
      "Pay-Per-Click Advertising",
      "Analytics Setup & Performance Tracking",
      "Conversion Rate Optimization",
      "Monthly Reporting & Strategy Adjustments",
    ],
    modals: [
      {
        id: 201,
        title: "SEO Essentials",
        pricing: "149£ per month",
        features: [
          "Complete Website SEO Audit",
          "Keyword Research & Strategy",
          "On-page SEO Optimization",
          "Content Optimization",
          "Schema Markup Implementation",
          "Google Business Profile Setup/Optimization",
          "Local SEO Improvements",
          "Basic Link Building",
          "Monthly Performance Reports",
          "3-Month Minimum Contract",
        ],
      },
      {
        id: 202,
        title: "Complete Digital Marketing",
        pricing: "299£ per month",
        features: [
          "Everything in SEO Essentials",
          "Advanced Technical SEO",
          "Premium Link Building Strategy",
          "Content Creation (2 Blog Posts/Month)",
          "Social Media Account Management",
          "Social Media Content Calendar",
          "Email Marketing Campaigns",
          "PPC Campaign Management",
          "Conversion Rate Optimization",
          "Comprehensive Analytics & Reporting",
          "Dedicated Account Manager",
          "6-Month Minimum Contract",
        ],
        highlight: true,
      },
    ],
  },
];

export default services;
