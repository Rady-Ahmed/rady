/* ============================================
   DATA MODULE — Projects, Services, Skills
   ============================================ */

const DATA = {
  personal: {
    name: "Rady Ahmed",
    title: "Full-Stack Developer",
    location: "Egypt",
    email: "radyahmed117@gmail.com",
    tagline: "I build real systems that solve real problems — from educational platforms to admin dashboards.",
    bio: `I'm a Full-Stack Developer based in Egypt, passionate about building production-ready web applications that make a difference. I don't just write code — I engineer complete systems with clean architecture, optimized performance, and premium user experiences.
    
My focus is on creating scalable solutions using modern web technologies, with expertise spanning from pixel-perfect frontends to robust backend systems. Every project I take on is treated as a product, not just a task.`,
    stats: {
      projects: 10,
      experience: "2+",
      clients: 5,
      satisfaction: "100%"
    }
  },

  social: {
    github: "https://github.com/rady-ahmed",
    linkedin: "https://www.linkedin.com/in/rady-ahmed",
    facebook: "https://www.facebook.com/radyahmed0",
    instagram: "https://www.instagram.com/radyahmed0",
    youtube: "https://www.youtube.com/@rady_ahmed",
    telegram: "https://t.me/Rady_ahmed",
    email: "mailto:radyahmed117@gmail.com",
    whatsapp: "https://wa.me/201101970882"
  },

  services: [
    {
      icon: "⚡",
      title: "Full-Stack Development",
      description: "End-to-end web application development from database architecture to pixel-perfect UI. Building scalable, maintainable systems using modern technologies.",
      features: ["React / Next.js", "PHP / MySQL", "RESTful APIs", "Database Design"]
    },
    {
      icon: "🔍",
      title: "SEO & Performance",
      description: "Technical SEO optimization and web performance engineering to ensure your site ranks high and loads fast. Core Web Vitals optimization included.",
      features: ["Technical SEO", "Core Web Vitals", "Page Speed", "Schema Markup"]
    },
    {
      icon: "🛠️",
      title: "Website Management",
      description: "Ongoing website maintenance, updates, and monitoring to keep your web presence running smoothly and securely.",
      features: ["Updates & Patches", "Security Monitoring", "Uptime Tracking", "Content Updates"]
    },
    {
      icon: "📊",
      title: "Data & Marketing",
      description: "Basic data analysis and digital marketing support, including Google Ads management and performance tracking for small businesses.",
      features: ["Google Ads", "Analytics Setup", "Campaign Tracking", "Basic Reporting"]
    }
  ],

  projects: [
    {
      id: "masar",
      title: "Masar Platform",
      subtitle: "Educational System",
      description: "A comprehensive educational platform designed for students, integrating YouTube course organization with an examination system for effective learning.",
      problem: "Students needed a structured way to follow YouTube courses with organized tracking, assessments, and progress monitoring — beyond just watching videos.",
      solution: "Built a full-stack educational platform that organizes YouTube courses into structured learning paths with integrated exams, progress tracking, and student management.",
      features: [
        "YouTube course integration & organization",
        "Automated exam & quiz system",
        "Student progress tracking dashboard",
        "Admin panel for content management",
        "Responsive design for mobile learning"
      ],
      tech: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
      result: "Successfully deployed and used by students to follow structured learning paths with measurable progress.",
      image: "assets/images/project-masar.webp",
      color: "#6366f1"
    },
    {
      id: "charity",
      title: "Charity Management System",
      subtitle: "Admin Operations Platform",
      description: "A comprehensive management system for charitable organizations, streamlining donation tracking, operations management, and reporting.",
      problem: "Charity organizations struggled with manual tracking of donations, operations, and beneficiary data, leading to inefficiency and lack of transparency.",
      solution: "Developed a robust admin system that digitizes all charity operations, from donation management to beneficiary tracking, with comprehensive reporting.",
      features: [
        "Donation tracking & management",
        "Beneficiary database system",
        "Operations workflow management", 
        "Financial reporting & analytics",
        "Role-based access control"
      ],
      tech: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
      result: "Streamlined operations for the organization with automated tracking and transparent reporting.",
      image: "assets/images/project-charity.webp",
      color: "#8b5cf6"
    },
    {
      id: "cleaning",
      title: "Cleaning Company Website",
      subtitle: "Business Service Website",
      description: "A professional business website for a service-based cleaning company, designed to generate leads and showcase services effectively.",
      problem: "The cleaning company lacked an online presence and was losing potential customers to competitors with professional websites.",
      solution: "Created a conversion-optimized business website with service showcase, booking integration, and strong calls-to-action for lead generation.",
      features: [
        "Service showcase with pricing",
        "Online booking system",
        "Customer testimonials section",
        "Mobile-first responsive design",
        "SEO-optimized for local search"
      ],
      tech: ["HTML", "CSS", "JavaScript", "PHP"],
      result: "Increased the company's online visibility and provided a professional platform for customer acquisition.",
      image: "assets/images/project-cleaning.webp",
      color: "#06b6d4"
    }
  ],

  plannedProjects: [
    {
      icon: "📋",
      title: "Admin Dashboard",
      description: "A full-stack admin dashboard system with real-time analytics, user management, and comprehensive CRUD operations.",
      tech: ["React", "Node.js", "MySQL"]
    },
    {
      icon: "🛒",
      title: "E-Commerce Store",
      description: "A complete e-commerce platform with cart, checkout, payment integration, and order management.",
      tech: ["Next.js", "PHP", "MySQL"]
    },
    {
      icon: "🤖",
      title: "AI-Based Tool",
      description: "An intelligent web tool leveraging AI APIs for content generation, analysis, or automation.",
      tech: ["React", "Node.js", "AI APIs"]
    }
  ],

  techStack: {
    frontend: [
      { name: "HTML5", icon: "html5" },
      { name: "CSS3", icon: "css3" },
      { name: "JavaScript", icon: "javascript" },
      { name: "React", icon: "react" },
      { name: "Next.js", icon: "nextjs" }
    ],
    backend: [
      { name: "PHP", icon: "php" },
      { name: "MySQL", icon: "mysql" },
      { name: "Node.js", icon: "nodejs" }
    ],
    tools: [
      { name: "Git", icon: "git" },
      { name: "VS Code", icon: "vscode" },
      { name: "Figma", icon: "figma" },
      { name: "npm", icon: "npm" }
    ],
    other: [
      { name: "SEO", icon: "seo" },
      { name: "Google Ads", icon: "googleads" },
      { name: "Analytics", icon: "analytics" },
      { name: "Performance", icon: "performance" }
    ]
  },

  dashboardStats: {
    users: { value: 2847, change: "+12.5%", label: "Total Users" },
    revenue: { value: "$48,295", change: "+8.2%", label: "Revenue" },
    projects: { value: 156, change: "+23.1%", label: "Projects" },
    uptime: { value: "99.9%", change: "+0.1%", label: "Uptime" }
  }
};
