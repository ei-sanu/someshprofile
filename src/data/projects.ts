import { Project } from '../types/project';

export const projects: Project[] = [
  {
    id: '1',
    title: 'Secure Chat Application',
    description: 'End-to-end encrypted chat application with advanced security features including perfect forward secrecy and secure key exchange protocols.',
    imageUrl: 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=800',
    techStack: ['Python', 'Flask', 'WebSockets', 'Cryptography', 'SQLite'],
    githubUrl: 'https://github.com/ei-sanu',
    category: 'Encryption utilities'
  },
  {
    id: '2',
    title: 'Intrusion Detection System',
    description: 'Real-time network intrusion detection system using machine learning algorithms to identify and alert on suspicious network activities.',
    imageUrl: 'https://images.pexels.com/photos/8728382/pexels-photo-8728382.jpeg?auto=compress&cs=tinysrgb&w=800',
    techStack: ['JavaScript', 'Node.js', 'TensorFlow.js', 'Express', 'MongoDB'],
    githubUrl: 'https://github.com/ei-sanu',
    category: 'Net Works'
  },
  {
    id: '3',
    title: 'Vulnerability Scanner',
    description: 'Automated vulnerability scanning tool that detects common security flaws in web applications and provides remediation recommendations.',
    imageUrl: 'https://images.pexels.com/photos/2908984/pexels-photo-2908984.jpeg?auto=compress&cs=tinysrgb&w=800',
    techStack: ['Go', 'Docker', 'PostgreSQL', 'gRPC'],
    githubUrl: 'https://github.com/ei-sanu',
    category: 'Secure coding templates'
  },
  {
    id: '4',
    title: 'Encryption Toolkit',
    description: 'Comprehensive encryption and decryption toolkit supporting multiple algorithms including AES, RSA, and modern cryptographic standards.',
    imageUrl: 'https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg?auto=compress&cs=tinysrgb&w=800',
    techStack: ['C++', 'OpenSSL', 'Qt', 'CMake'],
    githubUrl: 'https://github.com/ei-sanu',
    category: 'Encryption utilities'
  },
  {
    id: '5',
    title: 'Cybersecurity Dashboard',
    description: 'Modern web dashboard for monitoring security metrics, threat intelligence, and system health across multiple endpoints.',
    imageUrl: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=800',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Chart.js', 'Vite'],
    githubUrl: 'https://github.com/ei-sanu',
    liveUrl: '#',
    category: 'Front-End Web Dev'
  },
  {
    id: '6',
    title: 'Password Strength Analyzer',
    description: 'Advanced password strength analysis tool with entropy calculation, pattern detection, and security recommendations.',
    imageUrl: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800',
    techStack: ['Python', 'Django', 'Redis', 'Celery', 'React'],
    githubUrl: 'https://github.com/ei-sanu',
    category: 'Secure coding templates'
  }
];
