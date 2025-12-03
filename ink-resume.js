#!/usr/bin/env node
const React = require('react');
const { render, Text, Box } = require('ink');
const figlet = require('figlet');
const gradient = require('gradient-string');
const chalk = require('chalk');
const { portfolioData } = require('./index.js');

const { useState, useEffect } = React;

// Simple Ink app without JSX
const ResumeApp = () => {
  const [section, setSection] = useState(0);
  
  // Generate banner
  const banner = figlet.textSync(portfolioData.name.split(' ')[0], {
    font: 'Standard'
  });
  
  const sections = ['Summary', 'Work', 'Education', 'Skills', 'Projects', 'Contact'];
  
  return React.createElement(Box, {
    flexDirection: 'column',
    padding: 1
  }, [
    React.createElement(Text, { key: 'banner' }, gradient.pastel.multiline(banner)),
    React.createElement(Text, { 
      key: 'title',
      color: '#00D9FF',
      bold: true 
    }, `\n${portfolioData.title} @ ${portfolioData.company}\n`),
    React.createElement(Text, {
      key: 'summary',
      color: 'white'
    }, portfolioData.summary),
    React.createElement(Text, {
      key: 'footer',
      dimColor: true
    }, `\n\nPress Q to quit`)
  ]);
};

render(React.createElement(ResumeApp));
