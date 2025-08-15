import mongoose from "mongoose";
import dotenv from "dotenv";
import Job from "./models/Job.js";

dotenv.config();

const ADMIN_ID = "689d9c2288a77197ffc7c9c1"; // your admin _id from MongoDB

const jobs = [
  {
    title: "Frontend Developer",
    company: "TechSpark Solutions",
    location: "Remote",
    salary: "₹6–8 LPA",
    description: "Build modern, responsive UIs using React and TailwindCSS.",
    skills: ["React", "JavaScript", "TailwindCSS", "HTML", "CSS"],
    createdBy: ADMIN_ID
  },
  {
    title: "Backend Developer",
    company: "CodeWave Technologies",
    location: "Bangalore, India",
    salary: "₹7–9 LPA",
    description: "Develop robust APIs using Node.js and Express, integrate with MongoDB.",
    skills: ["Node.js", "Express", "MongoDB", "REST API", "JavaScript"],
    createdBy: ADMIN_ID
  },
  {
    title: "Java Developer",
    company: "GlobalLogic",
    location: "Hyderabad, India",
    salary: "₹6–10 LPA",
    description: "Work on enterprise-level Java applications using Spring Boot.",
    skills: ["Java", "Spring Boot", "MySQL", "Hibernate"],
    createdBy: ADMIN_ID
  },
  {
    title: "C++ Software Engineer",
    company: "Innovatech Systems",
    location: "Pune, India",
    salary: "₹8–12 LPA",
    description: "Design and implement high-performance C++ applications.",
    skills: ["C++", "STL", "Multithreading", "OOP"],
    createdBy: ADMIN_ID
  },
  {
    title: "Python Developer",
    company: "DataWorks Inc.",
    location: "Remote",
    salary: "₹5–8 LPA",
    description: "Develop Python-based data pipelines and automation scripts.",
    skills: ["Python", "Flask", "Pandas", "SQL"],
    createdBy: ADMIN_ID
  },
  {
    title: "Machine Learning Engineer",
    company: "AI Horizon",
    location: "Bangalore, India",
    salary: "₹10–15 LPA",
    description: "Design and deploy machine learning models for production.",
    skills: ["Python", "TensorFlow", "Scikit-learn", "Pandas", "NumPy"],
    createdBy: ADMIN_ID
  },
  {
    title: "Full Stack Developer",
    company: "NextGen Labs",
    location: "Chennai, India",
    salary: "₹8–11 LPA",
    description: "Work across the stack using React, Node.js, and MongoDB.",
    skills: ["React", "Node.js", "MongoDB", "JavaScript", "Express"],
    createdBy: ADMIN_ID
  },
  {
    title: "DevOps Engineer",
    company: "CloudNova",
    location: "Hyderabad, India",
    salary: "₹9–13 LPA",
    description: "Automate deployment pipelines and manage cloud infrastructure.",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Linux"],
    createdBy: ADMIN_ID
  },
  {
    title: "Data Analyst",
    company: "Insight Analytics",
    location: "Pune, India",
    salary: "₹5–7 LPA",
    description: "Analyze datasets to generate business insights.",
    skills: ["SQL", "Python", "Excel", "Tableau"],
    createdBy: ADMIN_ID
  },
  {
    title: "Blockchain Developer",
    company: "ChainLogic",
    location: "Remote",
    salary: "₹10–14 LPA",
    description: "Develop blockchain smart contracts and DApps.",
    skills: ["Solidity", "Ethereum", "Web3.js", "Node.js"],
    createdBy: ADMIN_ID
  },
  {
    title: "AI Research Intern",
    company: "DeepVision AI",
    location: "Remote",
    salary: "₹20,000/month stipend",
    description: "Assist in cutting-edge AI research projects.",
    skills: ["Python", "PyTorch", "NLP", "Computer Vision"],
    createdBy: ADMIN_ID
  },
  {
    title: "Cloud Engineer",
    company: "SkyNet Technologies",
    location: "Bangalore, India",
    salary: "₹8–12 LPA",
    description: "Manage multi-cloud deployments and monitoring.",
    skills: ["AWS", "Azure", "Terraform", "Ansible"],
    createdBy: ADMIN_ID
  },
  {
    title: "Cybersecurity Analyst",
    company: "SecureIT",
    location: "Hyderabad, India",
    salary: "₹7–10 LPA",
    description: "Monitor and respond to cybersecurity threats.",
    skills: ["Networking", "Linux", "Security Tools", "Python"],
    createdBy: ADMIN_ID
  },
  {
    title: "Game Developer",
    company: "PlayVerse Studios",
    location: "Mumbai, India",
    salary: "₹6–9 LPA",
    description: "Develop games using Unity and C#.",
    skills: ["Unity", "C#", "Game Design", "3D Modeling"],
    createdBy: ADMIN_ID
  },
  {
    title: "Embedded Systems Engineer",
    company: "MicroTech Embedded",
    location: "Chennai, India",
    salary: "₹8–11 LPA",
    description: "Work on embedded firmware development.",
    skills: ["C", "C++", "RTOS", "Microcontrollers"],
    createdBy: ADMIN_ID
  },
  {
    title: "Mobile App Developer",
    company: "Appify",
    location: "Remote",
    salary: "₹6–9 LPA",
    description: "Build cross-platform mobile apps using Flutter.",
    skills: ["Flutter", "Dart", "Firebase", "REST API"],
    createdBy: ADMIN_ID
  },
  {
    title: "UI/UX Designer",
    company: "DesignX",
    location: "Remote",
    salary: "₹5–8 LPA",
    description: "Design user-friendly and visually appealing interfaces.",
    skills: ["Figma", "Adobe XD", "UI/UX Design"],
    createdBy: ADMIN_ID
  },
  {
    title: "Site Reliability Engineer",
    company: "OpsHub",
    location: "Bangalore, India",
    salary: "₹9–14 LPA",
    description: "Ensure high availability and scalability of services.",
    skills: ["AWS", "Monitoring", "Linux", "Kubernetes"],
    createdBy: ADMIN_ID
  },
  {
    title: "AR/VR Developer",
    company: "ImmersiveTech",
    location: "Hyderabad, India",
    salary: "₹8–12 LPA",
    description: "Create AR/VR applications for various platforms.",
    skills: ["Unity", "C#", "ARKit", "ARCore"],
    createdBy: ADMIN_ID
  },
  {
    title: "Big Data Engineer",
    company: "DataGiant",
    location: "Bangalore, India",
    salary: "₹10–15 LPA",
    description: "Build and maintain big data pipelines.",
    skills: ["Hadoop", "Spark", "Kafka", "Scala"],
    createdBy: ADMIN_ID
  }
];

async function seedJobs() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    await Job.deleteMany({});
    console.log("Cleared old jobs");

    await Job.insertMany(jobs);
    console.log("Inserted new jobs");

    process.exit();
  } catch (error) {
    console.error("Error seeding jobs:", error);
    process.exit(1);
  }
}

seedJobs();
