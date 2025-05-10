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
      "Website Development with Latest Technologies",
      "Professional UI/UX Design with FIGMA",
      "High Quality Animation",
      "Powerful Functionality & Software Integration",
      "SEO-based Design & Development",
      "Mobile-Friendly Interface",
      "Content Management System (CMS)",
      "Social Media Integration",
      "Front End & Back End Support/Integration",
      "Security Protection (SSL Certificate)",
      "Web Hosting",
      "Ultra Blazing Fast Website",
      "Free Website Audit & SEO Audit",
      "Technical Support 365 - Maintenance & Backup",
    ],
    modals: [
      {
        id: 101,
        title: "1 Page Website",
        pricing: "£450",
        features: [
          "1 Page Website",
          "Includes Contact Page",
          "Professional UI/UX Design",
          "SEO based Design & Development",
          "Ultra Blazing Fast Website",
          "Smooth Animations",
          "Mobile Friendly",
          "Security Protection (SSL Certificate)",
          "Web Hosting Setup",
          "Delivery in 10 days",
        ],
      },
      {
        id: 102,
        title: "Business Essential",
        pricing: "£975",
        features: [
          "Up to 6 Page Website",
          "Includes BLOG Page & Testimonial & Gallery Page",
          "Professional UI/UX Design",
          "SEO based design & Development",
          "Ultra Blazing Fast Website",
          "High Quality Animations",
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
        pricing: "£1,450",
        features: [
          "Includes Everything from Business Essential",
          "Fully Customised 10+ Page Website",
          "Third-Party Software / API Integration",
          "Powerful Functionality",
          "Advanced Animations & Micro Interactions",
          "Full backend/CMS integration without any limitations",
          "1 year free premium Hosting",
          "Technical SEO Services for 2 months (On page SEO, Speed Optimisation, Schema Structured Data, Technical Fixes)",
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
      "Boost your online visibility and drive targeted traffic with our comprehensive SEO and Digital Marketing Solutions. Our data-driven strategies help you connect with your audience, increase brand awareness, and achieve measurable business growth.",
    gifUrl: "/images/service2.gif", // Replace with actual path in your project
    points: [
      "Free Website Audit & SEO Audit",
      "On-page SEO Optimisation",
      "Technical SEO & Site Speed Optimization",
      "Content Strategy & Creation",
      "Google Business Profile Optimization",
      "Brand Logo Design",
      "Visiting Card Design",
      "Social Media Platform Setup",
      "Google My Business Set-up + Optimisation",
      "Content and Blog Writing",
      "Promotional Materials like Leaflet Designs, Social Media Cover Design",
      "Video Editing (Client Testimonials, Shorts/Reels)",
    ],
    modals: [
      {
        id: 201,
        title: "Business Essential",
        pricing: "£199 per month",
        features: [
          "Create & Manage 2 Social Media Accounts",
          "2 Social Posts every week",
          "1 short/reel video per two weeks",
          "Infographics & Leaflets with social posts",
          "Google My Business Set-up",
          "1 Blog every 2 weeks",
          "Monthly Google Analytics Reports",
          "Complete Website SEO Audit",
          "Keyword Research & Strategy",
          "On-page SEO Optimization",
          "Content Optimization",
          "Schema Markup Implementation",
          "Google Business Profile Setup/Optimization",
          "6-Month Minimum Contract",
        ],
      },
      {
        id: 202,
        title: "Business Professional",
        pricing: "£299 per month",
        features: [
          "Everything in Business Essentials",
          "Logo design",
          "Business Card Design",
          "1 x High-Converting Email Template",
          "Create & Manage 3 Social Media Accounts",
          "3 Social Posts every week",
          "1 short/reel video per week",
          "Hashtag strategy optimization",
          "Professional Level Infographics & Leaflets with social posts",
          "Google My Business Set-up + Optimisation",
          "1 Blog every week",
          "Monthly Analytical Reports",
          "Advanced Technical SEO",
          "Conversion Rate Optimization",
          "Comprehensive Analytics & Reporting",
          "6-Month Minimum Contract",
        ],
        highlight: true,
      },
    ],
  },
];

export default services;
