document.addEventListener("DOMContentLoaded", function() {
    
    // Core Elements
    const heroLayer = document.getElementById('heroLayer');
    const scrollInstruction = document.getElementById('scrollInstruction');
    const scrollWrapper = document.getElementById('scrollWrapper');
    
    // Content Sections for new Professional Animation
    const sections = document.querySelectorAll('.content-section');

    let countersStarted = false;
    const counters = document.querySelectorAll('.counter');

    // Scrubber Logic
    window.addEventListener('scroll', () => {
        let scrollY = window.scrollY;
        // The body height is 500vh. Calculate max scroll depth in pixels.
        let maxScroll = document.body.scrollHeight - window.innerHeight;
        let progress = scrollY / maxScroll; // Value from 0.0 to 1.0

        // --- PHASE 1: EXPLODED VIEW (Logo zooms through screen) ---
        let explodeProgress = Math.min(Math.max((progress - 0.02) / 0.25, 0), 1);
        
        let logoScale = 1 + (explodeProgress * 25); 
        let logoOpacity = 1 - (explodeProgress * 1.5); 
        heroLayer.style.transform = `scale(${logoScale})`;
        heroLayer.style.opacity = Math.max(logoOpacity, 0);

        scrollInstruction.style.opacity = 1 - (progress * 15);

        // --- PHASE 2 & 3: CONTENT SCRUBBING & NEW ANIMATION ---
        
        let contentProgress = Math.min(Math.max((progress - 0.2) / 0.8, 0), 1);
        let wrapperHeight = scrollWrapper.offsetHeight;
        let startY = window.innerHeight; 
        let endY = -(wrapperHeight - window.innerHeight + 100); 
        
        let currentY = startY + (endY - startY) * contentProgress;
        scrollWrapper.style.transform = `translateY(${currentY}px)`;

        sections.forEach(section => {
            let rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) {
                section.classList.add('active');
                if (section.id === 'sectionStats' && !countersStarted) {
                    startCounters();
                }
            } else {
                section.classList.remove('active');
            }
        });
    });

    // Number Counter Logic
    function startCounters() {
        countersStarted = true;
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText.replace(/,/g, '');
                const inc = Math.max((target - count) / 12, 1);

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc).toLocaleString();
                    setTimeout(updateCount, 15);
                } else {
                    counter.innerText = target.toLocaleString() + (target > 100 ? '+' : '');
                }
            };
            updateCount();
        });
    }

    // Modal Tab Switching Logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            // Hide all forms
            tabContents.forEach(content => content.style.display = 'none');
            
            // Add active to clicked button
            btn.classList.add('active');
            // Show target form
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).style.display = 'block';
        });
    });
});

// Modal Logic 
const modal = document.getElementById('authModal');
function openRegistration() {
    modal.classList.add('active');
}
function closeModal() {
    modal.classList.remove('active');
}

// Logo acts as Register button
document.getElementById('heroLogoBtn').addEventListener('click', openRegistration);

// Close modal when clicking outside
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModal();
    }
});

// SKILL SET AUTOCOMPLETE LOGIC
const allSkills = [
    "ABAP", "ACID Compliance", "Adobe Photoshop", "Agentforce", "Agentic AI", "Agentic Automations", 
    "Agile Collaboration", "Agile Development Methodologies", "AI Business Strategy", "Alchemy", 
    "Algorithm Optimization", "Algorithms", "Amazon Redshift", "Anchor", "Angular", "Animation", 
    "Ansible", "Apache Airflow", "Apache Kafka", "Apache Spark", "Apache Tomcat", "Apex", "API Testing", 
    "AppExchange", "Application Security", "Appium", "ARCore", "ArgoCD", "ARKit", "Augmented Reality (AR)", 
    "Automated Market Makers (AMMs)", "AWS", "AWS Braket", "AWS GameLift", "AWS Glue", "AWS SageMaker", 
    "AWS Well-Architected Framework", "Azure DevOps", "Azure Quantum", "Bash", "Behavior-Driven Development (BDD)", 
    "Big Data Analytics", "Blender", "BrowserStack", "Business Analysis", "Business Process Automation", 
    "C", "C#", "C++", "Calculus", "Capacity Planning", "Cassandra", "Chainlink", "Chef", "Cirq", 
    "Claude APIs", "Client-Server Game Architecture", "Cloud Computing Strategy", 
    "Cloud Cost Optimization (Financial Stewardship)", "Code Review", "Collision Detection", "Computer Vision", 
    "Container Orchestration", "Containerization", "Continuous Integration / Continuous Deployment (CI/CD)", 
    "Continuous Integration for Data", "Continuous Testing", "Creative Direction", "Cross-Browser Testing", 
    "Cross-Chain Bridges", "Cross-departmental Communication", "Cross-Functional Collaboration", "Cryptography", 
    "Cryogenics", "Cucumber", "Cursor", "Customer Relationship Management (CRM)", "Cypress", "daisyUI", 
    "Data Fabric", "Data Governance", "Data Mesh", "Data Modeling", "Data Observability", "Data Preprocessing", 
    "Data Structures", "Databricks", "Datadog", "dbt (Data Build Tool)", "Decentralized Autonomous Organizations (DAOs)", 
    "Decentralized Finance (DeFi) Protocols", "Deep Learning", "Defect Management", "Dependency Injection", 
    "Digital Signatures", "Dimensional Modeling", "Disaster Recovery", "Distributed Processing", "Distributed Systems", 
    "Django", "Docker", "Eclipse ADT", "Elasticsearch", "End-to-End (E2E) Testing", "Enterprise Resource Planning (ERP)", 
    "Entity-Component Systems (ECS)", "Entanglement", "ERC-20 / ERC-721 / ERC-1155 Token Standards", "Ethereum", 
    "Ethereum Virtual Machine (EVM)", "Ethers.js", "Ethics & Bias Mitigation", "Event Sourcing", 
    "Event-Driven Architecture", "Event-Driven Integrations", "Extract, Load, Transform (ELT)", "FastAPI", 
    "Feature Engineering", "Financial Accounting (FICO)", "Financial Modeling", "Firebase", "Fivetran", "Flow Builder", 
    "Foundry", "Game AI / Pathfinding", "Game Engine Architecture", "Generative AI", "Git", "GitHub Actions", 
    "GitLab CI", "GitOps", "Go", "Godot Engine", "Google BigQuery", "Google Cloud Platform (GCP)", "Grafana", "GraphQL", 
    "Hardhat", "Hardware-Software Co-Design", "Hash Functions", "High Availability Design", "HTC Vive SDK", 
    "Hugging Face", "Hybrid Workflows", "Hyperledger Fabric", "IBM Quantum", "Identity Management", 
    "Immutable Infrastructure", "Infura", "Infrastructure as Code (IaC)", "IntelliJ IDEA", "IPFS", "IT Governance", 
    "IT Service Management (ITSM)", "ITIL Framework", "Java", "JavaScript", "Jenkins", "Jira", "JMeter", "JSON", 
    "Julia", "JUnit", "Jupyter Notebooks", "JWT Authentication", "Kappa Architectures", "Keras", "Kubernetes", 
    "Lakehouse Architecture", "Lambda Architectures", "LangChain", "LangGraph", "Layer 2 Scaling (Rollups)", 
    "Lightning Component Framework", "Linear Algebra", "Live Service Operations", "LlamaIndex", "Load and Stress Testing", 
    "Looker", "Machine Learning algorithms", "Mathematics (Quaternions, Vectors)", "Matrix Algebra", "Maya", 
    "Memory Management", "MetaMask", "Metric Reporting", "Microservices Architecture", "Microsoft Azure", "Milvus", 
    "MLflow", "MLOps", "Mobile Automation", "Model Context Protocol (MCP)", "Model Fine-Tuning", 
    "Model-View-Controller (MVC)", "MongoDB", "Moralis", "MuleSoft", "Multiplayer Networking", "Multi-tenant Architecture", 
    "Natural Language Processing (NLP)", ".NET Core", "Network Engineering", "Neural Networks", "Next.js", "NGINX", 
    "NISQ Constraints", "Node.js", "OAuth", "Object-Oriented Programming (OOP)", "Oculus SDK", "OData Services", 
    "OpenAI APIs", "OpenFermion", "OpenZeppelin", "Oracle", "Order-to-Cash (O2C)", "OWASP Security Standards", 
    "Page Object Model (POM)", "Parallel Execution", "Peer-to-Peer (P2P) Networking", "PennyLane", "Perforce", 
    "Performance Optimization", "Performance Profiling", "Performance Tuning", "Physics", "Physics Simulation", 
    "Pinecone", "Playwright", "Polygon", "PostgreSQL", "Postman", "Power BI", "PowerShell", "Problem Solving", 
    "Procedural Content Generation", "Procure-to-Pay (P2P)", "Project Management", "Prometheus", "Prompt Engineering", 
    "Prompt Tuning", "Protocol Governance", "Puppet", "PyTorch", "Python", "Q#", "Qiskit", "Quality Assurance", 
    "Quantum Approximate Optimization (QAOA)", "Quantum Circuit Design", "Quantum Cryptography (QKD)", 
    "Quantum Error Correction (QEC)", "Quantum Machine Learning (QML)", "Quantum Mechanics", "Query Optimization", 
    "R", "React.js", "Redis", "Regulatory Compliance", "Reinforcement Learning", "Relational Databases", 
    "Rendering Pipelines", "Replication", "Requirements Gathering", "Research and Development", "REST Assured", 
    "RESTful APIs", "Retrieval-Augmented Generation (RAG)", "Risk Analysis", "Ruby", "Rust", "Sales/Finance Modeling", 
    "Salesforce CRM", "Salesforce Trailhead", "SAP BTP (Business Technology Platform)", "SAP CPI (Cloud Platform Integration)", 
    "SAP Fiori", "SAP RAP (RESTful ABAP Programming)", "SAP S/4HANA", "Scala", "Scikit-learn", "Scrum for Game Dev", 
    "Secure Coding Practices", "Security Auditing", "Security Engineering", "Selenium WebDriver", "Semantic Routing", 
    "Serverless Computing", "ServiceNow", "Shader Programming", "Sharding", "Shift-Left Security", "Shift-Left Testing", 
    "Signal Processing", "Single Page Applications (SPA)", "Smart Contracts", "Snowflake", "Snyk", "SoapUI", 
    "Software Quality Assurance", "Solana", "Solidity", "SonarQube", "SOQL", "SOSL", "Spatial Audio", "Spring Boot", 
    "Stakeholder Communication", "Static/Dynamic Application Security Testing (SAST/DAST)", "Statistics", 
    "Storage Management", "Substance Painter", "Superposition", "System Administration", "Tableau", "Tailwind CSS", 
    "Technical Leadership", "TensorFlow", "Terraform", "Test Automation Framework Design", "Test-Driven Development (TDD)", 
    "Testing Methodologies", "TestNG", "Threat Analysis", "Threat Modeling", "TOGAF", "Tokenomics", 
    "Transformer Architectures", "Trivy", "Truffle", "TypeScript", "UI/UX Design", "Unity 3D", "Unreal Engine 5", 
    "Variational Quantum Algorithms (VQA)", "Variational Quantum Eigensolver (VQE)", "Vector Search", "Vercel", 
    "Virtual DOM", "Virtual Reality (VR)", "Visual Studio Code", "Visualforce", "Vulnerability Management", "Weaviate", 
    "Web3.js", "WebXR", "Weights & Biases", "Windsurf", "Workflow Design", "Xilinx/Altera FPGA control", 
    "Zero Trust Architecture", "Zero-Knowledge Proofs", "Active Listening", "Adaptability and Flexibility", 
    "Client and Stakeholder Management", "Collaboration and Teamwork", "Communication (Written and Verbal)", 
    "Conflict Resolution", "Continuous Learning", "Creative Problem Solving", "Critical Thinking", "Empathy", 
    "Emotional Intelligence (EQ)", "Leadership and Mentorship", "Negotiation", "Presentation and Public Speaking", 
    "Time Management and Prioritization"
];

const skillsInput = document.getElementById('candidateSkills');
const skillsDropdown = document.getElementById('skillsDropdown');
const selectedSkillsContainer = document.getElementById('selectedSkills');
let selectedSkills = [];

if (skillsInput) {
    // Listen for typing
    skillsInput.addEventListener('input', function() {
        const val = this.value.toLowerCase();
        skillsDropdown.innerHTML = '';
        
        if (!val) {
            skillsDropdown.style.display = 'none';
            return;
        }

        // Filter skills
        const matchedSkills = allSkills.filter(skill => 
            skill.toLowerCase().includes(val) && !selectedSkills.includes(skill)
        );

        if (matchedSkills.length > 0) {
            matchedSkills.forEach(skill => {
                const item = document.createElement('div');
                item.className = 'autocomplete-item';
                // Highlight matching part
                const regex = new RegExp(`(${val})`, "gi");
                item.innerHTML = skill.replace(regex, "<strong>$1</strong>");
                
                // Add click listener
                item.addEventListener('click', function() {
                    addSkill(skill);
                });
                skillsDropdown.appendChild(item);
            });
            skillsDropdown.style.display = 'block';
        } else {
            skillsDropdown.style.display = 'none';
        }
    });

    // Hide dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target !== skillsInput && e.target !== skillsDropdown) {
            skillsDropdown.style.display = 'none';
        }
    });
}

function addSkill(skill) {
    if (!selectedSkills.includes(skill)) {
        selectedSkills.push(skill);
        renderSkills();
    }
    skillsInput.value = '';
    skillsDropdown.style.display = 'none';
    skillsInput.focus();
}

function removeSkill(skill) {
    selectedSkills = selectedSkills.filter(s => s !== skill);
    renderSkills();
}

function renderSkills() {
    selectedSkillsContainer.innerHTML = '';
    selectedSkills.forEach(skill => {
        const chip = document.createElement('div');
        chip.className = 'skill-chip';
        chip.innerHTML = `${skill} <span onclick="removeSkill('${skill}')">&times;</span>`;
        selectedSkillsContainer.appendChild(chip);
    });
}
