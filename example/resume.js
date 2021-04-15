const toMd = require('./generate-resume-text')

const resume = {
  header: {
    name: 'Andrew Chang-DeWitt',
    email: 'hire-me@andrew-chang-dewitt.dev',
    phone: '8122660282',
    website: 'andrew-chang-dewitt.dev',
    github: 'github.com/andrew-chang-dewitt',
    title: 'Software Developer',
  },
  'about-me': "I make web apps, API's, IoT programs, & cli utilities.",
  experience: [
    {
      title: 'Cheese Drawer (current project)',
      repo: {
        href: 'https://github.com/cheese-drawer',
        display: 'github.com/cheese-drawer',
      },
      'more-info': {
        href: '',
        display: 'FIXME: no blog post yet, write & link to it here',
      },
      stack: [
        'Python',
        'Typescript',
        'React',
        'PostgreSQL',
        'MongoDB',
        'AMQP 0-9-1',
        'Docker',
        'microservices',
      ],
      summary: [
        'Building a budgeting application, inspired by my favorite (defunct) fintech product, currently a work in progress',
        'Deploying back-end with Docker Swarm as a collection of microservices',
        'Communication between services implemented with AMQP (using RabbitMQ), exposing endpoints to client applications over HTTP as a single RESTful Gateway API',
        "Created AMQP worker library modeled after Flask's API",
        'Writing in Python (Flask, Psycopg2, aio-pika) & Typescript (React) with data storage in PostgreSQL & MongoDB',
      ],
    },
    {
      title: 'We Cook Sometimes',
      url: {
        href: 'https://we-cook-sometimes.andrew-chang-dewitt.dev',
        display: 'we-cook-sometimes.andrew-chang-dewitt.dev',
      },
      repo: {
        href: 'https://github.com/andrew-chang-dewitt/we-cook-sometimes',
        display: 'github.com/andrew-chang-dewitt/we-cook-sometimes',
      },
      'more-info': {
        href: '',
        display: 'FIXME: no blog post yet, write & link to it here',
      },
      stack: [
        'Typescript',
        'React',
        'React-Router',
        'SASS',
        'CSS-modules',
        'Webpack',
        'Node',
        'Express',
        'NGINX',
        'Mocha',
        'Enzyme',
        'React Testing Library',
      ],
      summary: [
        'Created a single-page web application with React & Typescript to help my family & I pick something to cook & share our recipes',
        'Implemented a [custom graph data structure object](https://andrew-chang-dewitt.dev/blog/posts/implementing-graphs-in-typescript) with iteration methods using depth-first search algorithm',
        "Developed a [Result type for Typescript](https://andrew-chang-dewitt.dev/blog/posts/implementing-graphs-in-typescript), similar to Rust's Result enum, to encapsulate success & failure states",
        "Built RESTful API to synchronize data Trello content (using Trello's API & webhooks) with NodeJS & MongoDB",
      ],
    },
    {
      title: 'Personal Website & Blog',
      url: {
        href: 'https://andrew-chang-dewitt.dev',
        display: 'andrew-chang-dewitt.dev',
      },
      repo: {
        href:
          'https://github.com/andrew-chang-dewitt/andrew-chang-dewitt-website',
        display: 'github.com/andrew-chang-dewitt/andrew-chang-dewitt-website',
      },
      'more-info': {
        href: '',
        display: 'FIXME: no blog post yet, write & link to it here',
      },
      stack: [
        'Typescript',
        'Javascript',
        'SASS',
        'Gatsby',
        'CSS-modules',
        'Node',
        'Express',
        'NGINX',
        'Mocha',
        'Enzyme',
        'React Testing Library',
      ],
      summary: [
        'Built a personal website using Typescript, React, & Gatsby to promote myself as a software developer',
        "Improved Gatsby's Reach Router dependency with a custom implementation of hash routing & anchor links",
        'Implemented blog with dynamically generated post pages, post list page, & filtering/sorting using GraphQL & a custom React hook for managing query parameters',
        "Next steps: convert the all the tests to Jest & rewrite any Enzyme tests to React Testing Library, Gatsby & Mocha don't play well together",
      ],
    },
    {
      title: 'Pi GPIO Sensor to MQTT Module',
      repo: {
        href: 'https://github.com/andrew-chang-dewitt/rpi-security-gpio2mqtt',
        display: 'github.com/andrew-chang-dewitt/rpi-security-gpio2mqtt',
      },
      'more-info': {
        href: '',
        display: 'FIXME: no blog post yet, write & link to it here',
      },
      stack: ['Python', 'MQTT', 'pytest', 'Docker'],
      summary: [
        "Created an IOT microservice to monitor sensors attached to a Raspberry Pi's GPIO pins",
        'Designed to communicate with a custom home security alarm system, as well Home Assistant for home automations',
        'Distributed as a Dockerfile to aid in installation & maintenance',
        'Reads configuration from a user-maintained YAML file',
        'Implemented sensors as an extensible library to allow users to easily add new sensor types',
        'Next steps: rewrite in Rust with compilation target being a microcontroller, such as Arduino or ESP32 board',
      ],
    },
  ],
  employment: [
    {
      title: 'Department of Family Resources',
      positions: [
        {
          'job-title': 'State Eligibility Consultant',
          employer: 'State of Indiana',
          start: 'June 2019',
          end: 'August 2020',
        },
        {
          'job-title': 'Eligibility Specialist Working Lead',
          employer: 'Knowledge Services',
          start: 'May 2018',
          end: 'June 2019',
        },
        {
          'job-title': 'Eligibility Specialist',
          employer: 'Knowledge Services',
          start: 'January 2018',
          end: 'May 2018',
        },
        {
          'job-title': 'Eligibility Specialist',
          employer: 'Conduent',
          start: 'August 2016',
          end: 'December 2017',
        },
      ],
      summary: [
        'Started as a contract employee & learned quickly, advancing to a lead position among a team of contractors',
        'Promoted again to state employee in June of 2019',
        'Communicated directly with clients to solve issues & share information',
        'Trained new employees & worked with experienced employees improve customer service, communication, & problem-solving skills',
        'Collaborated with local office & regional management to improve business processes for efficiency & accuracy',
      ],
    },
  ],
  education: [
    {
      school: 'Indiana University—Purdue University Indianapolis',
      degree: 'BS in Informatics',
      minor: 'Computer & Information Science',
      date: {
        expectedGraduation: 'December 2023',
      },
      location: 'Indianapolis, Indiana',
    },
  ],
}

console.log(toMd.default(resume))
