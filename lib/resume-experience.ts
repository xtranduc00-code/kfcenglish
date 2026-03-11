export type ResumeExperienceItem = {
    year: string;
    title: string;
    subTitle?: string;
    bullets: string[];
};
export const RESUME_EXPERIENCE_EN: ResumeExperienceItem[] = [
    {
        year: "Dec 2024 – Present",
        title: "Freelance Programming Tutor",
        bullets: [
            "Provided programming tutoring in Java, Python, C++, and web development",
            "Supported high school and international students with academic projects",
            "Focused on problem-solving, algorithmic thinking, and practical coding skills",
        ],
    },
    {
        year: "Sep 2023 – Nov 2024",
        title: "Programming Instructor",
        subTitle: "Rikkei Academy",
        bullets: [
            "Taught fullstack development (JavaScript, React, HTML/CSS) through project-based learning",
            "Guided students in building real-world applications and understanding development workflows",
            "Mentored students on debugging, coding practices, and software design",
        ],
    },
    {
        year: "Jun 2022 – Sep 2023",
        title: "Programming Instructor / Teaching Assistant",
        subTitle: "MindX Technology School",
        bullets: [
            "Delivered programming courses (Scratch, Python, Web Development) to students aged 6–17",
            "Supported curriculum delivery and interactive learning activities",
            "Helped students complete coding projects and develop logical thinking",
        ],
    },
    {
        year: "2022",
        title: "Frontend Developer (Intern)",
        subTitle: "Success Software Services",
        bullets: [
            "Participated in frontend development using ReactJS, Next.js, and TypeScript",
            "Worked with Git, Jira, and component-based UI systems",
            "Collaborated in a team environment following development workflows",
        ],
    },
];
export const RESUME_EXPERIENCE_VI: ResumeExperienceItem[] = [
    {
        year: "Th12 2024 – Hiện tại",
        title: "Gia sư lập trình tự do",
        bullets: [
            "Dạy lập trình Java, Python, C++ và web cho học sinh",
            "Hỗ trợ học sinh phổ thông và quốc tế làm đồ án",
            "Tập trung tư duy giải quyết vấn đề, thuật toán và kỹ năng code thực tế",
        ],
    },
    {
        year: "Th9 2023 – Th11 2024",
        title: "Giảng viên lập trình",
        subTitle: "Học viện Rikkei",
        bullets: [
            "Giảng dạy fullstack (JavaScript, React, HTML/CSS) theo hướng dự án",
            "Hướng dẫn học viên xây ứng dụng thực tế và quy trình phát triển",
            "Hỗ trợ debug, thực hành code và thiết kế phần mềm",
        ],
    },
    {
        year: "Th6 2022 – Th9 2023",
        title: "Giảng viên / Trợ giảng lập trình",
        subTitle: "MindX Technology School",
        bullets: [
            "Giảng Scratch, Python, Web Development cho học sinh 6–17 tuổi",
            "Hỗ trợ giáo trình và hoạt động học tương tác",
            "Giúp học viên hoàn thành dự án và phát triển tư duy logic",
        ],
    },
    {
        year: "2022",
        title: "Lập trình viên Frontend (Thực tập)",
        subTitle: "Success Software Services",
        bullets: [
            "Tham gia phát triển frontend với ReactJS, Next.js, TypeScript",
            "Làm việc với Git, Jira và UI dạng component",
            "Làm việc nhóm theo quy trình phát triển chuẩn",
        ],
    },
];
