#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const boxen = require('boxen');
const inquirer = require('inquirer');
const open = require('open');
const ora = require('ora');
const clear = require('clear');

// Portfolio Data
const portfolioData = {
  name: 'Rantideb Howlader',
  title: 'Site Reliability Engineer',
  company: 'Airbnb',
  location: 'Boston, USA',
  email: 'connect@ranti.dev',
  whatsapp: '+1 (617) 322-4667',
  website: 'https://ranti.dev',
  blog: 'https://textandtech.me/',
  github: 'https://github.com/Rantideb',
  linkedin: 'https://linkedin.com/in/rantideb',
  twitter: 'https://x.com/r4ntide3',
  
  bio: 'Code meets literature. Shakespeare would\'ve loved React hooks.',
  
  summary: 'My calendar is such a plot twist that it could be Dan Brown\'s muse, with one foot stuck in JavaScript and the other tripping over postcolonial theory. Equal parts Gatsby\'s optimism and Hermione\'s curiosity (but still searching for the right page number), I\'m just as likely to break my code as to misinterpret a metaphor.',
  
  work: [
    {
      company: 'Airbnb',
      title: 'Site Reliability Engineer',
      period: 'Sep 2025 - Present',
      location: 'Hybrid',
      highlights: [
        'Monitoring system health across multiple backend services and microservices',
        'Developing automation scripts and internal tools using JavaScript and Node.js',
        'Managing CI/CD pipelines with GitHub Actions',
        'Participating in on-call rotations and incident response'
      ]
    },
    {
      company: 'DesignSilc',
      title: 'Sales, Content & Developer (WordPress/MERN)',
      period: 'Aug 2025 - Present',
      location: 'Remote (Part-time)',
      highlights: [
        'Building and optimizing WordPress and MERN stack applications',
        'Implementing SEO strategies and content production',
        'Leading full-stack technical delivery for global clients'
      ]
    },
    {
      company: 'Freelance / CodeBoxr / HandyMama',
      title: 'Full-Stack Web Developer & Content Specialist',
      period: 'Nov 2014 - Present',
      location: 'Remote',
      highlights: [
        'Delivered 70+ web projects for clients in 15+ countries',
        'Built complete web rebuild for Banaras Hindu University (30,000+ users monthly)',
        'Developed 30+ dynamic websites using Node.js, React.js, WordPress',
        'Achieved 98% client satisfaction rating with 60%+ repeat business'
      ]
    }
  ],
  
  education: [
    {
      school: 'Boston University',
      degree: 'Integrated Course (Masters & PhD)',
      field: 'Comparative Studies in English and American Literature and Culture',
      period: 'Aug 2025 - Present',
      role: 'Graduate Teaching Assistant to',
      professor: 'Prof. Susan Mizruchi'
    },
    {
      school: 'Banaras Hindu University',
      degree: 'Master of Arts in English Literature',
      period: 'Aug 2023 - Jun 2025',
      award: 'Master\'s Project Fellowship'
    },
    {
      school: 'Banaras Hindu University',
      degree: 'Bachelor of Arts in English (Honours)',
      period: 'Sep 2020 - Jun 2023',
      award: 'ICCR Scholarship'
    },
    {
      school: 'Satyajit Ray Film & Television Institute',
      degree: 'Certificate Course',
      field: 'Direction and Screenplay Writing',
      period: 'Jun 2019 - Aug 2020'
    }
  ],
  
  skills: {
    'Programming & Development': ['JavaScript', 'TypeScript', 'Node.js', 'React.js', 'Next.js', 'Python', 'Go', 'HTML/CSS', 'REST APIs', 'GraphQL', 'SQL', 'NoSQL'],
    'DevOps, Cloud & Infrastructure': ['Docker', 'Kubernetes', 'GitHub Actions', 'CI/CD Pipelines', 'ArgoCD', 'Apache Airflow', 'Datadog', 'AWS', 'Vercel', 'Netlify', 'Linux', 'System Design', 'Terraform', 'Prometheus', 'Grafana'],
    'Databases & Storage': ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'ChromaDB', 'SQLite', 'DynamoDB', 'Elasticsearch'],
    'Quality Assurance & Testing': ['Pytest', 'Jest', 'Mocha', 'Unit Testing', 'Integration Testing', 'Load Testing', 'K6', 'Postman', 'Selenium', 'Test Automation'],
    'CMS, UI/UX & Design': ['WordPress', 'Elementor', 'WooCommerce', 'Figma', 'Adobe XD', 'UI/UX Design', 'Wireframing', 'Prototyping', 'User Testing', 'Accessibility Design (WCAG)'],
    'Research & Academia': ['Literature Reviews', 'Digital Humanities Research', 'Archival Research', 'Critical Theory (Trauma & Disability Studies)', 'Survey Design & Interviews', 'Research Publications', 'Conference Presentations', 'Academic Workshops', 'Lesson Planning & Curriculum Design', 'Citation (MLA, APA, Chicago, Harvard)', 'Report & Policy Paper Preparation'],
    'Soft Skills & Leadership': ['Technical Documentation', 'Project Management', 'Agile/Scrum', 'Team Leadership', 'Stakeholder Communication', 'Problem Solving', 'Incident Management', 'On-Call Support', 'Mentoring']
  },
  
  projects: [
    {
      name: 'LitAssist AI',
      description: 'RAG-based AI research assistant for literature studies',
      tech: ['Python', 'FastAPI', 'ChromaDB', 'OpenAI']
    },
    {
      name: 'Rana Foundation Website',
      description: 'Official website and offline management software for NGO',
      tech: ['Next.js', 'React', 'Node.js', 'Electron.js', 'SQLite']
    },
    {
      name: 'Student Event Management Platform',
      description: 'Full-stack platform for 5,000+ participants',
      tech: ['React.js', 'Node.js', 'MongoDB', 'AWS', 'Socket.io']
    }
  ],
  
  awards: [
    'ICCR Scholarship (2020-2023)',
    'Master\'s Project Fellowship (2023-2025)',
    'Champion - Tourism Student Conclave India (2023)',
    'Events Coordinator, Student Wellbeing Cell, BHU'
  ],
  
  publications: [
    'AI and the Art of Storytelling (Conference Proceedings, 2024)',
    '50+ SEO Articles & Technical Documentation',
    'Voices That Break: Stammering as Trauma in South Asian Literature (In Progress)'
  ],
  
  interests: [
    'Postcolonial and World Literatures',
    'Digital Humanities',
    'Trauma and Disability Studies',
    'Literary Theory & Cultural Studies'
  ]
};

// Display Functions
function showWelcomeCard() {
  const terminalWidth = process.stdout.columns || 80;
  const boxWidth = Math.min(Math.max(terminalWidth - 10, 60), 90);
  
  const card = boxen(
    [
      chalk.bold.cyan(portfolioData.name),
      chalk.white(`${portfolioData.title} @ ${chalk.hex('#FF5A5F').bold(portfolioData.company)}`),
      chalk.white('Integrated Course (Masters & PhD), Comparative Studies'),
      chalk.white('in English and American Language, Literature and Culture'),
      chalk.white('@ Boston University'),
      chalk.white(portfolioData.location),
      '',
      chalk.white(portfolioData.bio),
      '',
      chalk.dim('"Code breaks. Metaphors misbehave. Both need debugging."')
    ].join('\n'),
    {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'cyan',
      align: 'center',
      width: boxWidth
    }
  );
  console.log(card);
  console.log('\n\n\n'); // Multiple newlines to ensure buffer
  process.stdout.write(''); // Flush output buffer
}

function showWorkExperience() {
  clear(true);
  const terminalWidth = process.stdout.columns || 80;
  const boxWidth = Math.min(Math.max(terminalWidth - 10, 60), 100);
  console.log(boxen(chalk.bold.cyan('💼 WORK EXPERIENCE'), { padding: 1, borderColor: 'cyan', align: 'center' }));
  console.log('');
  
  portfolioData.work.forEach((job, index) => {
    console.log(chalk.bold.yellow(`${index + 1}. ${job.company}`));
    console.log(chalk.white(`   ${job.title}`));
    console.log(chalk.white(`   ${job.period} • ${job.location}`));
    console.log('');
    job.highlights.forEach(highlight => {
      console.log(chalk.white(`   • ${highlight}`));
    });
    console.log('');
  });
  
  waitForContinue();
}

function showEducation() {
  clear(true);
  const terminalWidth = process.stdout.columns || 80;
  const boxWidth = Math.min(Math.max(terminalWidth - 10, 60), 100);
  console.log(boxen(chalk.bold.cyan('🎓 EDUCATION'), { padding: 1, borderColor: 'cyan', align: 'center' }));
  console.log('');
  
  portfolioData.education.forEach((edu, index) => {
    console.log(chalk.bold.yellow(`${index + 1}. ${edu.school}`));
    console.log(chalk.white(`   ${edu.degree}`));
    if (edu.field) console.log(chalk.white(`   ${edu.field}`));
    console.log(chalk.white(`   ${edu.period}`));
    if (edu.award) console.log(chalk.green(`   🏆 ${edu.award}`));
    if (edu.role) {
      const roleText = edu.professor ? `${edu.role} ${edu.professor}` : edu.role;
      console.log(chalk.blue(`   📚 ${roleText}`));
    }
    console.log('');
  });
  
  waitForContinue();
}

function showSkills() {
  clear(true);
  const terminalWidth = process.stdout.columns || 80;
  const boxWidth = Math.min(Math.max(terminalWidth - 10, 60), 100);
  console.log(boxen(chalk.bold.cyan('⚙️ SKILLS & EXPERTISE'), { padding: 1, borderColor: 'cyan', align: 'center' }));
  console.log('');
  
  Object.keys(portfolioData.skills).forEach(category => {
    console.log(chalk.bold.yellow(`${category}:`));
    console.log(chalk.white(`   ${portfolioData.skills[category].join(' • ')}`));
    console.log('');
  });
  
  waitForContinue();
}

function showProjects() {
  clear(true);
  const terminalWidth = process.stdout.columns || 80;
  const boxWidth = Math.min(Math.max(terminalWidth - 10, 60), 100);
  console.log(boxen(chalk.bold.cyan('🚀 FEATURED PROJECTS'), { padding: 1, borderColor: 'cyan', align: 'center' }));
  console.log('');
  
  portfolioData.projects.forEach((project, index) => {
    console.log(chalk.bold.yellow(`${index + 1}. ${project.name}`));
    console.log(chalk.white(`   ${project.description}`));
    console.log(chalk.white(`   Tech: ${project.tech.join(', ')}`));
    console.log('');
  });
  
  waitForContinue();
}

function showAwards() {
  clear(true);
  const terminalWidth = process.stdout.columns || 80;
  const boxWidth = Math.min(Math.max(terminalWidth - 10, 60), 100);
  console.log(boxen(chalk.bold.cyan('🏆 AWARDS & RECOGNITION'), { padding: 1, borderColor: 'cyan', align: 'center' }));
  console.log('');
  
  portfolioData.awards.forEach((award, index) => {
    console.log(chalk.yellow(`${index + 1}. `) + chalk.white(award));
  });
  console.log('');
  
  waitForContinue();
}

function showPublications() {
  clear(true);
  const terminalWidth = process.stdout.columns || 80;
  const boxWidth = Math.min(Math.max(terminalWidth - 10, 60), 100);
  console.log(boxen(chalk.bold.cyan('📝 PUBLICATIONS & RESEARCH'), { padding: 1, borderColor: 'cyan', align: 'center' }));
  console.log('');
  
  portfolioData.publications.forEach((pub, index) => {
    console.log(chalk.yellow(`${index + 1}. `) + chalk.white(pub));
  });
  console.log('');
  
  waitForContinue();
}

function showInterests() {
  clear(true);
  const terminalWidth = process.stdout.columns || 80;
  const boxWidth = Math.min(Math.max(terminalWidth - 10, 60), 100);
  console.log(boxen(chalk.bold.cyan('🔬 RESEARCH INTERESTS'), { padding: 1, borderColor: 'cyan', align: 'center' }));
  console.log('');
  
  portfolioData.interests.forEach((interest, index) => {
    console.log(chalk.yellow(`${index + 1}. `) + chalk.white(interest));
  });
  console.log('');
  
  waitForContinue();
}

function showContact() {
  clear(true);
  const contactCard = boxen(
    [
      chalk.bold.cyan('📬 CONTACT INFORMATION'),
      '',
      chalk.white('Email:    ') + chalk.green(portfolioData.email),
      chalk.white('WhatsApp: ') + chalk.yellow(portfolioData.whatsapp),
      chalk.white('Website:  ') + chalk.cyan(portfolioData.website),
      chalk.white('Blog:     ') + chalk.magenta(portfolioData.blog),
      chalk.white('GitHub:   ') + chalk.green(portfolioData.github),
      chalk.white('LinkedIn: ') + chalk.blue(portfolioData.linkedin),
      chalk.white('Twitter:  ') + chalk.cyan(portfolioData.twitter)
    ].join('\n'),
    {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'cyan'
    }
  );
  console.log(contactCard);
  console.log('');
  
  waitForContinue();
}

// Helper function to wrap text to fit within box
function wrapText(text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';
  
  words.forEach(word => {
    const testLine = currentLine ? currentLine + ' ' + word : word;
    // Strip ANSI codes for length calculation
    const visualLength = testLine.replace(/\x1b\[[0-9;]*m/g, '').replace(/[\u{1F300}-\u{1F9FF}]/gu, '  ').length;
    
    if (visualLength <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  });
  
  if (currentLine) lines.push(currentLine);
  return lines.join('\n');
}

function showFullResume() {
  clear(true);
  
  // Launch the Ink app for interactive resume
  const { spawn } = require('child_process');
  const path = require('path');
  const inkAppPath = path.join(__dirname, 'ink-app.js');
  
  const inkProcess = spawn('node', [inkAppPath], {
    stdio: 'inherit'
  });
  
  inkProcess.on('close', (code) => {
    // Small delay to ensure terminal is ready, then return to main menu
    setTimeout(() => {
      clear(true);
      showMainMenu();
    }, 100);
  });
  
  inkProcess.on('error', (err) => {
    console.error(chalk.red('Error launching interactive resume:'), err);
    setTimeout(() => {
      showMainMenu();
    }, 1000);
  });
}

function waitForContinue() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'continue',
      message: chalk.cyan('Press Enter to return to main menu...')
    }
  ]).then(() => {
    clear(true); // true flag clears scrollback buffer
    showMainMenu();
  });
}

function showMainMenu() {
  clear(true); // true flag clears scrollback buffer
  showWelcomeCard();
  
  // Small delay to ensure welcome card renders completely before inquirer starts
  setImmediate(() => {
    console.log(chalk.cyan('\n💡 Tip: You can also type commands like "education", "skills", "work", etc.\n'));
    
    inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to explore?',
        choices: [
          { name: '💼 Work Experience', value: 'work' },
          { name: '🎓 Education', value: 'education' },
          { name: '⚙️ Skills & Expertise', value: 'skills' },
          { name: '🚀 Featured Projects', value: 'projects' },
          { name: '🏆 Awards & Recognition', value: 'awards' },
          { name: '📝 Publications & Research', value: 'publications' },
          { name: '🔬 Research Interests', value: 'interests' },
          { name: '📬 Contact Information', value: 'contact' },
          new inquirer.Separator(),
          { name: '🌐 Visit Website', value: 'website' },
          { name: '📧 Send Email', value: 'email' },
          { name: '💼 View LinkedIn', value: 'linkedin' },
          { name: '🐙 View GitHub', value: 'github' },
          { name: '📝 Read Blog', value: 'blog' },
          new inquirer.Separator(),
          { name: chalk.cyan.bold('📄 View Full Resume (Visual Mode)'), value: 'resume' },
          { name: chalk.magenta('⌨️  Type Command'), value: 'command' },
          new inquirer.Separator(),
          { name: chalk.red('❌ Exit'), value: 'exit' }
        ]
      }
    ]).then(answer => {
      if (answer.action === 'command') {
        showCommandPrompt();
      } else {
        handleAction(answer.action);
      }
    });
  });
}

function showCommandPrompt() {
  clear(true);
  console.log(boxen(
    chalk.cyan.bold('⌨️  COMMAND MODE') + '\n\n' +
    chalk.white('Type any of these commands:') + '\n' +
    chalk.white('work, education, skills, projects, awards, publications, interests, contact,') + '\n' +
    chalk.white('resume, website, email, linkedin, github, blog, menu, exit'),
    { padding: 1, margin: 1, borderColor: 'magenta' }
  ));
  
  inquirer.prompt([
    {
      type: 'input',
      name: 'command',
      message: chalk.cyan('Enter command:'),
      validate: (input) => {
        const validCommands = ['work', 'education', 'skills', 'projects', 'awards', 'publications', 
                               'interests', 'contact', 'resume', 'website', 'email', 'linkedin', 
                               'github', 'blog', 'menu', 'exit'];
        if (validCommands.includes(input.toLowerCase().trim())) {
          return true;
        }
        return 'Invalid command. Please try again.';
      }
    }
  ]).then(answer => {
    const cmd = answer.command.toLowerCase().trim();
    if (cmd === 'menu') {
      showMainMenu();
    } else {
      handleAction(cmd);
    }
  });
}

function handleAction(action) {
  switch(action) {
    case 'resume':
      showFullResume();
      break;

    case 'work': showWorkExperience(); break;
    case 'education': showEducation(); break;
    case 'skills': showSkills(); break;
    case 'projects': showProjects(); break;
    case 'awards': showAwards(); break;
    case 'publications': showPublications(); break;
    case 'interests': showInterests(); break;
    case 'contact': showContact(); break;
    case 'website':
      const spinner1 = ora('Opening website...').start();
      setTimeout(() => {
        spinner1.succeed('Opened ranti.dev');
        open(portfolioData.website);
        setTimeout(showMainMenu, 1000);
      }, 1000);
      break;
    case 'email':
      open(`mailto:${portfolioData.email}`);
      console.log(chalk.green('\n✨ Opening your email client...\n'));
      setTimeout(showMainMenu, 1000);
      break;
    case 'linkedin':
      const spinner2 = ora('Opening LinkedIn...').start();
      setTimeout(() => {
        spinner2.succeed('Opened LinkedIn');
        open(portfolioData.linkedin);
        setTimeout(showMainMenu, 1000);
      }, 1000);
      break;
    case 'github':
      const spinner3 = ora('Opening GitHub...').start();
      setTimeout(() => {
        spinner3.succeed('Opened GitHub');
        open(portfolioData.github);
        setTimeout(showMainMenu, 1000);
      }, 1000);
      break;
    case 'blog':
      const spinner4 = ora('Opening blog...').start();
      setTimeout(() => {
        spinner4.succeed('Opened blog');
        open(portfolioData.blog);
        setTimeout(showMainMenu, 1000);
      }, 1000);
      break;
    case 'exit':
      console.log(boxen(
        chalk.green.bold('👋 Thanks for exploring my portfolio!\n\n') +
        chalk.white('Feel free to reach out:\n') +
        chalk.cyan(portfolioData.email),
        { padding: 1, borderColor: 'green', margin: 1 }
      ));
      process.exit(0);
  }
}

// Start the application
// Run CLI only if this file is executed directly
if (require.main === module) {
  showMainMenu();
}

// Export portfolioData for ink-app.js
exports.portfolioData = portfolioData;
