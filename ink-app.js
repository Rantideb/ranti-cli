#!/usr/bin/env node
const React = require('react');
const { render, Box, Text, useApp, useInput } = require('ink');
const figlet = require('figlet');
const gradient = require('gradient-string');
const chalk = require('chalk');
const { portfolioData } = require('./index.js');

const { useState, useEffect, useMemo } = React;

// ==================== THEMES ====================
const themes = {
  dark: {
    primary: '#FF5A5F',
    accent: '#00D9FF',
    text: '#EEEEEE',
    dim: '#888888',
    bg: '#1a1a1a'
  },
  light: {
    primary: '#007A87',
    accent: '#C778FF',
    text: '#111111',
    dim: '#666666',
    bg: '#f5f5f5'
  }
};

// ==================== HOOKS ====================

// Typing animation hook
const useTyped = (text, speed = 50) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    if (!text) return;
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayText(text.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    
    return () => clearInterval(interval);
  }, [text, speed]);
  
  return displayText;
};

// ==================== COMPONENTS ====================

// Banner Component
const Banner = ({ theme }) => {
  const art = useMemo(() => {
    try {
      return figlet.textSync(portfolioData.name.split(' ')[0], { 
        font: 'Standard',
        horizontalLayout: 'default'
      });
    } catch (e) {
      return portfolioData.name;
    }
  }, []);
  
  const coloredArt = gradient.pastel.multiline(art);
  
  return React.createElement(Box, {
    flexDirection: 'column',
    marginBottom: 1
  }, [
    React.createElement(Text, { key: 'art' }, coloredArt)
  ]);
};

// Tabs Component
const Tabs = ({ tabs, activeIndex, theme }) => {
  return React.createElement(Box, {
    flexDirection: 'row',
    marginTop: 1,
    marginBottom: 1
  }, tabs.map((tab, index) => {
    const isActive = index === activeIndex;
    return React.createElement(Box, {
      key: tab,
      marginRight: 2,
      paddingX: 1,
      borderStyle: isActive ? 'round' : undefined,
      borderColor: isActive ? theme.accent : undefined
    }, [
      React.createElement(Text, {
        key: 'text',
        color: isActive ? theme.primary : theme.dim,
        bold: isActive
      }, tab)
    ]);
  }));
};

// Home Component
const Home = ({ theme }) => {
  return React.createElement(Box, {
    flexDirection: 'column',
    paddingTop: 1,
    paddingX: 2,
    paddingBottom: 3
  }, [
    React.createElement(Text, {
      key: 'welcome',
      color: theme.primary,
      bold: true
    }, '👋 Welcome to my interactive CLI Resume'),
    React.createElement(Text, { key: 'break1' }, '\n\n'),
    React.createElement(Text, {
      key: 'title',
      color: theme.accent,
      bold: true
    }, `${portfolioData.title} @ ${portfolioData.company}`),
    React.createElement(Text, { key: 'break2' }, '\n'),
    React.createElement(Text, {
      key: 'location',
      color: theme.dim
    }, `PhD Candidate • ${portfolioData.location}`),
    React.createElement(Text, { key: 'break3' }, '\n\n'),
    React.createElement(Box, {
      key: 'summary-box',
      borderStyle: 'round',
      borderColor: theme.accent,
      padding: 1
    }, [
      React.createElement(Text, {
        key: 'summary',
        color: theme.text
      }, portfolioData.summary)
    ])
  ]);
};

// Timeline Component (for Work & Education)
const Timeline = ({ items, theme, type, isActive }) => {
  const [scrollOffset, setScrollOffset] = useState(0);
  
  // Reset scroll to top when tab becomes active
  useEffect(() => {
    if (isActive) {
      setScrollOffset(0);
    }
  }, [isActive]);
  
  // Calculate how many items fit on screen
  const terminalHeight = process.stdout.rows || 24;
  const linesPerItem = 8; // Approximate lines per work/education item
  const headerSpace = 12; // Banner + tabs + footer
  const maxVisible = Math.max(2, Math.floor((terminalHeight - headerSpace) / linesPerItem));
  
  useInput((input, key) => {
    if (key.upArrow && scrollOffset > 0) {
      setScrollOffset(scrollOffset - 1);
    }
    if (key.downArrow && scrollOffset < items.length - maxVisible) {
      setScrollOffset(scrollOffset + 1);
    }
  });
  
  const visibleItems = items.slice(scrollOffset, scrollOffset + maxVisible);
  const hasMore = scrollOffset + maxVisible < items.length;
  const hasPrevious = scrollOffset > 0;
  
  return React.createElement(Box, {
    flexDirection: 'column',
    paddingTop: 1,
    height: '100%',
    minHeight: 0
  }, [
    ...visibleItems.map((item, index) => {
    const actualIndex = scrollOffset + index;
    const elements = [];
    
    // Company/School name
    elements.push(React.createElement(Text, {
      key: `name-${actualIndex}`,
      color: theme.primary,
      bold: true
    }, `● ${item.company || item.school}`));
    
    elements.push(React.createElement(Text, { key: `br1-${actualIndex}` }, '\n'));
    
    // Title/Degree
    elements.push(React.createElement(Text, {
      key: `title-${actualIndex}`,
      color: theme.accent
    }, `  ${item.title || item.degree}`));
    
    if (item.field) {
      elements.push(React.createElement(Text, {
        key: `field-${actualIndex}`,
        color: theme.text
      }, ` — ${item.field}`));
    }
    
    elements.push(React.createElement(Text, { key: `br2-${actualIndex}` }, '\n'));
    
    // Period & Location
    elements.push(React.createElement(Text, {
      key: `period-${actualIndex}`,
      color: theme.dim
    }, `  ${item.period}${item.location ? ' • ' + item.location : ''}`));
    
    elements.push(React.createElement(Text, { key: `br3-${actualIndex}` }, '\n'));
    
    // Highlights or Awards/Role
    if (item.highlights) {
      item.highlights.forEach((highlight, hIdx) => {
        elements.push(React.createElement(Text, {
          key: `highlight-${actualIndex}-${hIdx}`,
          color: theme.text
        }, `  • ${highlight}\n`));
      });
    }
    
    if (item.award) {
      elements.push(React.createElement(Text, {
        key: `award-${actualIndex}`,
        color: 'green'
      }, `  🏆 ${item.award}\n`));
    }
    
    if (item.role) {
      const roleText = item.professor ? `${item.role} ${item.professor}` : item.role;
      elements.push(React.createElement(Text, {
        key: `role-${actualIndex}`,
        color: 'blue'
      }, `  📚 ${roleText}\n`));
    }
    
    elements.push(React.createElement(Text, { key: `br4-${actualIndex}` }, '\n'));
    
    return React.createElement(Box, {
      key: `item-${actualIndex}`,
      flexDirection: 'column',
      marginBottom: 1
    }, elements);
  }),
  (hasPrevious || hasMore) && React.createElement(Box, {
    key: 'scroll-hint',
    marginTop: 1,
    justifyContent: 'center'
  }, [
    React.createElement(Text, {
      key: 'hint',
      color: theme.dim,
      dimColor: true
    }, `${hasPrevious ? '↑ ' : ''}Scroll ${hasMore ? '↓' : ''}  •  ${scrollOffset + 1}-${Math.min(scrollOffset + maxVisible, items.length)} of ${items.length}`)
  ])
  ]);
};

// Scrollable Full Resume Component
const ScrollResume = ({ theme, isActive }) => {
  const [scrollOffset, setScrollOffset] = useState(0);
  
  // Reset scroll to top when tab becomes active
  useEffect(() => {
    if (isActive) {
      setScrollOffset(0);
    }
  }, [isActive]);
  
  // Calculate how many lines fit on screen
  const terminalHeight = process.stdout.rows || 24;
  const headerSpace = 12;
  const maxVisible = Math.max(10, terminalHeight - headerSpace);
  
  const lines = useMemo(() => {
    const result = [];
    
    // Professional Summary
    result.push(chalk.hex(theme.primary).bold('━'.repeat(60)));
    result.push(chalk.hex(theme.primary).bold('💡 PROFESSIONAL SUMMARY'));
    result.push(chalk.hex(theme.primary).bold('━'.repeat(60)));
    result.push(portfolioData.summary);
    result.push('');
    
    // Work Experience
    result.push(chalk.hex(theme.primary).bold('━'.repeat(60)));
    result.push(chalk.hex(theme.primary).bold('💼 PROFESSIONAL EXPERIENCE'));
    result.push(chalk.hex(theme.primary).bold('━'.repeat(60)));
    portfolioData.work.forEach(job => {
      result.push(chalk.hex(theme.accent).bold(`● ${job.company.toUpperCase()}`));
      result.push(chalk.hex(theme.text)(`  ${job.title}`));
      result.push(chalk.dim(`  ${job.period} • ${job.location}`));
      job.highlights.forEach(h => result.push(`  • ${h}`));
      result.push('');
    });
    
    // Education
    result.push(chalk.hex(theme.primary).bold('━'.repeat(60)));
    result.push(chalk.hex(theme.primary).bold('🎓 EDUCATION'));
    result.push(chalk.hex(theme.primary).bold('━'.repeat(60)));
    portfolioData.education.forEach(edu => {
      result.push(chalk.hex(theme.accent).bold(`● ${edu.school.toUpperCase()}`));
      result.push(chalk.hex(theme.text)(`  ${edu.degree}${edu.field ? ' — ' + edu.field : ''}`));
      result.push(chalk.dim(`  ${edu.period}`));
      if (edu.award) result.push(chalk.green(`  🏆 ${edu.award}`));
      if (edu.role) {
        const roleText = edu.professor ? `${edu.role} ${edu.professor}` : edu.role;
        result.push(chalk.blue(`  📚 ${roleText}`));
      }
      result.push('');
    });
    
    // Skills
    result.push(chalk.hex(theme.primary).bold('━'.repeat(60)));
    result.push(chalk.hex(theme.primary).bold('⚙️ SKILLS & EXPERTISE'));
    result.push(chalk.hex(theme.primary).bold('━'.repeat(60)));
    Object.entries(portfolioData.skills).forEach(([category, skills]) => {
      result.push(chalk.hex(theme.accent).bold(category.toUpperCase()));
      result.push(chalk.hex(theme.text)(skills.join(' • ')));
      result.push('');
    });
    
    // Projects
    result.push(chalk.hex(theme.primary).bold('━'.repeat(60)));
    result.push(chalk.hex(theme.primary).bold('🚀 KEY PROJECTS'));
    result.push(chalk.hex(theme.primary).bold('━'.repeat(60)));
    portfolioData.projects.forEach(proj => {
      result.push(chalk.hex(theme.accent).bold(`● ${proj.name.toUpperCase()}`));
      result.push(chalk.hex(theme.text)(`  ${proj.description}`));
      result.push(chalk.dim(`  Tech: ${proj.tech.join(', ')}`));
      result.push('');
    });
    
    result.push(chalk.hex(theme.dim)('─'.repeat(60)));
    result.push(chalk.hex(theme.dim)('Developed with ❤️  Rantideb'));
    
    return result;
  }, [theme]);
  
  useInput((input, key) => {
    if (key.upArrow && scrollOffset > 0) {
      setScrollOffset(scrollOffset - 1);
    }
    if (key.downArrow && scrollOffset < lines.length - maxVisible) {
      setScrollOffset(scrollOffset + 1);
    }
  });
  
  const visibleLines = lines.slice(scrollOffset, scrollOffset + maxVisible);
  
  return React.createElement(Box, {
    flexDirection: 'column',
    paddingBottom: 3,
    height: '100%',
    minHeight: 0
  }, [
    React.createElement(Text, {
      key: 'content'
    }, visibleLines.join('\n')),
    React.createElement(Text, {
      key: 'scroll-hint',
      color: theme.dim
    }, `\n↑ ↓ Scroll • Line ${scrollOffset + 1}/${lines.length}`)
  ]);
};

// Skills Component
const SkillsUI = ({ theme }) => {
  const [scrollOffset, setScrollOffset] = useState(0);
  const categories = Object.entries(portfolioData.skills);
  
  // Calculate how many categories fit on screen
  const terminalHeight = process.stdout.rows || 24;
  const linesPerCategory = 4; // Category title + skills + spacing
  const headerSpace = 12;
  const maxVisible = Math.max(3, Math.floor((terminalHeight - headerSpace) / linesPerCategory));
  
  useInput((input, key) => {
    if (key.upArrow && scrollOffset > 0) {
      setScrollOffset(scrollOffset - 1);
    }
    if (key.downArrow && scrollOffset < categories.length - maxVisible) {
      setScrollOffset(scrollOffset + 1);
    }
  });
  
  const visibleCategories = categories.slice(scrollOffset, scrollOffset + maxVisible);
  const hasMore = scrollOffset + maxVisible < categories.length;
  const hasPrevious = scrollOffset > 0;
  
  return React.createElement(Box, {
    flexDirection: 'column',
    paddingTop: 1,
    height: '100%',
    minHeight: 0
  }, [
    ...visibleCategories.map(([category, skills], index) => {
    return React.createElement(Box, {
      key: category,
      flexDirection: 'column',
      marginBottom: 1
    }, [
      React.createElement(Text, {
        key: 'category',
        color: theme.accent,
        bold: true
      }, category.toUpperCase()),
      React.createElement(Text, { key: 'break' }, '\n'),
      React.createElement(Text, {
        key: 'skills',
        color: theme.text
      }, skills.join(' • '))
    ]);
  }),
  (hasPrevious || hasMore) && React.createElement(Box, {
    key: 'scroll-hint',
    marginTop: 1,
    justifyContent: 'center'
  }, [
    React.createElement(Text, {
      key: 'hint',
      color: theme.dim
    }, `${hasPrevious ? '↑ ' : ''}Scroll ${hasMore ? '↓' : ''}  •  Showing ${scrollOffset + 1}-${Math.min(scrollOffset + maxVisible, categories.length)} of ${categories.length} categories`)
  ])
  ]);
};

// Projects Component
const Projects = ({ theme }) => {
  const [scrollOffset, setScrollOffset] = useState(0);
  
  // Calculate how many projects fit on screen
  const terminalHeight = process.stdout.rows || 24;
  const linesPerProject = 8; // Project card with border, name, description, tech
  const headerSpace = 12;
  const maxVisible = Math.max(1, Math.floor((terminalHeight - headerSpace) / linesPerProject));
  
  useInput((input, key) => {
    if (key.upArrow && scrollOffset > 0) {
      setScrollOffset(scrollOffset - 1);
    }
    if (key.downArrow && scrollOffset < portfolioData.projects.length - maxVisible) {
      setScrollOffset(scrollOffset + 1);
    }
  });
  
  const visibleProjects = portfolioData.projects.slice(scrollOffset, scrollOffset + maxVisible);
  const hasMore = scrollOffset + maxVisible < portfolioData.projects.length;
  const hasPrevious = scrollOffset > 0;
  
  return React.createElement(Box, {
    flexDirection: 'column',
    paddingTop: 1,
    height: '100%',
    minHeight: 0
  }, [
    ...visibleProjects.map((project, index) => {
    return React.createElement(Box, {
      key: project.name,
      flexDirection: 'column',
      borderStyle: 'round',
      borderColor: theme.accent,
      padding: 1,
      marginBottom: 1
    }, [
      React.createElement(Text, {
        key: 'name',
        color: theme.primary,
        bold: true
      }, project.name.toUpperCase()),
      React.createElement(Text, { key: 'break1' }, '\n'),
      React.createElement(Text, {
        key: 'description',
        color: theme.text
      }, project.description),
      React.createElement(Text, { key: 'break2' }, '\n'),
      React.createElement(Text, {
        key: 'tech',
        color: theme.dim
      }, `Tech: ${project.tech.join(', ')}`)
    ]);
  }),
  (hasPrevious || hasMore) && React.createElement(Box, {
    key: 'scroll-hint',
    marginTop: 1,
    justifyContent: 'center'
  }, [
    React.createElement(Text, {
      key: 'hint',
      color: theme.dim
    }, `${hasPrevious ? '↑ ' : ''}Scroll ${hasMore ? '↓' : ''}  •  Project ${scrollOffset + 1}-${Math.min(scrollOffset + maxVisible, portfolioData.projects.length)} of ${portfolioData.projects.length}`)
  ])
  ]);
};

// Contact Component
const ContactUI = ({ theme }) => {
  return React.createElement(Box, {
    flexDirection: 'column',
    paddingTop: 1,
    paddingBottom: 3,
    height: '100%',
    minHeight: 0
  }, [
    React.createElement(Text, {
      key: 'header',
      color: theme.primary,
      bold: true
    }, '📬 CONTACT INFORMATION\n\n'),
    React.createElement(Text, {
      key: 'email',
      color: theme.text
    }, `✉  Email:    ${portfolioData.email}\n`),
    React.createElement(Text, {
      key: 'website',
      color: theme.text
    }, `🌐 Website:  ${portfolioData.website}\n`),
    React.createElement(Text, {
      key: 'github',
      color: theme.text
    }, `🐙 GitHub:   ${portfolioData.github}\n`),
    React.createElement(Text, {
      key: 'linkedin',
      color: theme.text
    }, `💼 LinkedIn: ${portfolioData.linkedin}\n`),
    React.createElement(Text, {
      key: 'blog',
      color: theme.text
    }, `📝 Blog:     ${portfolioData.blog}\n`)
  ]);
};

// ==================== MAIN APP ====================
const InkApp = () => {
  const { exit } = useApp();
  const tabs = ['Home', 'Resume', 'Work', 'Education', 'Skills', 'Projects', 'Contact'];
  const [activeTab, setActiveTab] = useState(0);
  const [themeName, setThemeName] = useState('dark');
  
  const theme = themes[themeName];
  
  // Clear and reset terminal position when tab changes
  useEffect(() => {
    // Move cursor to top of screen when switching tabs
    process.stdout.write('\x1b[H');
  }, [activeTab]);
  
  useInput((input, key) => {
    // Navigate tabs
    if (key.leftArrow) {
      setActiveTab((activeTab - 1 + tabs.length) % tabs.length);
    }
    if (key.rightArrow) {
      setActiveTab((activeTab + 1) % tabs.length);
    }
    
    // Toggle theme
    if (input === 't' || input === 'T') {
      setThemeName(themeName === 'dark' ? 'light' : 'dark');
    }
    
    // Quit
    if (input === 'q' || input === 'Q') {
      exit();
    }
  });
  
  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return React.createElement(Home, { theme, isActive: activeTab === 0 });
      case 1:
        return React.createElement(ScrollResume, { theme, isActive: activeTab === 1 });
      case 2:
        return React.createElement(Timeline, { items: portfolioData.work, theme, type: 'work', isActive: activeTab === 2 });
      case 3:
        return React.createElement(Timeline, { items: portfolioData.education, theme, type: 'education', isActive: activeTab === 3 });
      case 4:
        return React.createElement(SkillsUI, { theme, isActive: activeTab === 4 });
      case 5:
        return React.createElement(Projects, { theme, isActive: activeTab === 5 });
      case 6:
        return React.createElement(ContactUI, { theme, isActive: activeTab === 6 });
      default:
        return React.createElement(Home, { theme, isActive: true });
    }
  };
  
  const terminalHeight = process.stdout.rows || 24;
  const terminalWidth = process.stdout.columns || 80;
  
  // Reserve space for footer (4 lines to ensure no overlap)
  const footerHeight = 4;
  const contentAreaHeight = terminalHeight - footerHeight;
  
  return React.createElement(Box, {
    flexDirection: 'column',
    width: terminalWidth,
    height: terminalHeight
  }, [
    React.createElement(Box, {
      key: 'main-area',
      flexDirection: 'column',
      height: contentAreaHeight,
      flexShrink: 0
    }, [
      React.createElement(Box, {
        key: 'header',
        flexDirection: 'column',
        paddingX: 1,
        paddingTop: 1,
        flexShrink: 0
      }, [
        React.createElement(Banner, { key: 'banner', theme }),
        React.createElement(Tabs, { key: 'tabs', tabs, activeIndex: activeTab, theme })
      ]),
      React.createElement(Box, { 
        key: 'content', 
        flexDirection: 'column',
        paddingX: 1,
        flexGrow: 1,
        flexShrink: 1,
        minHeight: 0
      }, [
        renderContent()
      ])
    ]),
    React.createElement(Box, {
      key: 'footer',
      paddingX: 1,
      paddingY: 1,
      borderStyle: 'single',
      borderColor: theme.accent,
      justifyContent: 'center',
      height: footerHeight,
      flexShrink: 0
    }, [
      React.createElement(Text, {
        key: 'controls',
        color: theme.accent,
        bold: true
      }, '← → Navigate Tabs  •  ↑ ↓ Scroll Content  •  T Theme Toggle  •  Q Quit')
    ])
  ]);
};

// ==================== RENDER ====================
if (require.main === module) {
  // Enter alternate screen buffer - like vim/less
  process.stdout.write('\x1b[?1049h');
  // Clear screen and move to top
  process.stdout.write('\x1b[2J\x1b[H');
  
  // Use Ink's built-in rendering
  const { unmount, waitUntilExit, clear } = render(React.createElement(InkApp), {
    patchConsole: false,
    exitOnCtrlC: false
  });
  
  // When app exits, restore original screen
  waitUntilExit().then(() => {
    process.stdout.write('\x1b[?1049l');
  });
}

module.exports = { InkApp };
