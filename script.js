// Resume Optimizer - Enhanced Text Analysis Tool
class ResumeAnalyzer {
    constructor() {
        this.jobDescriptionTextarea = document.getElementById('jobDescription');
        this.resumeTextarea = document.getElementById('resumeText');
        this.analyzeButton = document.getElementById('analyzeBtn');
        this.clearButton = document.getElementById('clearBtn');
        this.resultContainer = document.getElementById('results');
        this.themeToggle = document.getElementById('themeToggle');

        this.initializeEventListeners();
        this.initializeTheme();
        this.initializeSynonymDatabase();
    }

    initializeEventListeners() {
        this.analyzeButton.addEventListener('click', () => this.analyzeResume());
        this.clearButton.addEventListener('click', () => this.clearFields());
        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Auto-analyze when content changes (with debounce)
        let timeout;
        const autoAnalyze = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if (this.jobDescriptionTextarea.value.trim() && this.resumeTextarea.value.trim()) {
                    this.analyzeResume();
                }
            }, 1000);
        };

        this.jobDescriptionTextarea.addEventListener('input', autoAnalyze);
        this.resumeTextarea.addEventListener('input', autoAnalyze);
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = savedTheme || (prefersDark ? 'dark' : 'light');

        document.documentElement.setAttribute('data-theme', theme);
        this.updateThemeIcon(theme);
    }

    initializeSynonymDatabase() {
        // Enhanced synonym and terminology database for better matching
        this.synonyms = {
            // Technical skills synonyms
            'javascript': ['js', 'ecmascript', 'node.js', 'nodejs', 'react', 'vue', 'angular'],
            'python': ['py', 'django', 'flask', 'fastapi', 'pandas', 'numpy'],
            'database': ['db', 'sql', 'mysql', 'postgresql', 'mongodb', 'nosql', 'sqlite'],
            'frontend': ['front-end', 'ui', 'user interface', 'client-side', 'responsive'],
            'backend': ['back-end', 'server-side', 'api', 'microservices', 'rest'],
            'devops': ['dev ops', 'ci/cd', 'deployment', 'automation', 'infrastructure'],
            'cloud': ['aws', 'azure', 'gcp', 'google cloud', 'amazon web services', 'saas'],
            'agile': ['scrum', 'kanban', 'sprint', 'iterative', 'jira'],
            'machine learning': ['ml', 'ai', 'artificial intelligence', 'deep learning', 'neural networks'],
            'data analysis': ['analytics', 'big data', 'statistics', 'data science', 'reporting'],

            // Soft skills synonyms
            'leadership': ['lead', 'manage', 'supervise', 'direct', 'guide', 'mentor', 'coach'],
            'communication': ['collaborate', 'present', 'explain', 'coordinate', 'articulate'],
            'problem-solving': ['troubleshoot', 'debug', 'resolve', 'analyze', 'innovate'],
            'teamwork': ['collaboration', 'team player', 'cross-functional', 'cooperative'],
            'organization': ['planning', 'prioritize', 'time management', 'multitask', 'efficient'],

            // Action words synonyms
            'developed': ['built', 'created', 'designed', 'implemented', 'programmed', 'engineered'],
            'managed': ['led', 'supervised', 'coordinated', 'oversaw', 'directed', 'administered'],
            'improved': ['enhanced', 'optimized', 'streamlined', 'upgraded', 'refined'],
            'achieved': ['accomplished', 'delivered', 'completed', 'attained', 'realized'],
            'collaborated': ['worked with', 'partnered', 'cooperated', 'teamed', 'liaised']
        };

        // Role-specific terminology database
        this.roleTerminology = {
            'software engineer': ['coding', 'programming', 'algorithms', 'data structures', 'debugging', 'testing', 'git', 'version control', 'software development'],
            'data scientist': ['machine learning', 'statistics', 'python', 'r', 'sql', 'visualization', 'modeling', 'analytics', 'data mining'],
            'product manager': ['roadmap', 'stakeholders', 'requirements', 'user stories', 'metrics', 'analytics', 'agile', 'strategy'],
            'designer': ['ui/ux', 'wireframes', 'prototypes', 'user research', 'design systems', 'figma', 'sketch', 'user experience'],
            'marketing': ['campaigns', 'analytics', 'conversion', 'engagement', 'brand', 'content', 'social media', 'seo'],
            'sales': ['revenue', 'leads', 'conversion', 'crm', 'pipeline', 'quota', 'relationship building', 'negotiation'],
            'devops': ['infrastructure', 'deployment', 'ci/cd', 'monitoring', 'automation', 'containers', 'kubernetes', 'docker'],
            'business analyst': ['requirements', 'process improvement', 'stakeholders', 'documentation', 'analysis', 'workflow'],
            'project manager': ['project management', 'timeline', 'budget', 'risk management', 'stakeholder management', 'planning'],
            'frontend developer': ['html', 'css', 'javascript', 'react', 'vue', 'angular', 'responsive design', 'user interface']
        };

        // Comprehensive skills database
        this.skillsDatabase = {
            hard_skills: {
                programming: ['javascript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'typescript', 'kotlin', 'swift'],
                frameworks: ['react', 'angular', 'vue', 'django', 'flask', 'spring', 'express', 'laravel', 'rails', 'next.js'],
                databases: ['mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'cassandra', 'oracle', 'sqlite'],
                cloud: ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins', 'ansible'],
                tools: ['git', 'jira', 'confluence', 'slack', 'figma', 'photoshop', 'excel', 'tableau', 'power bi'],
                methodologies: ['agile', 'scrum', 'kanban', 'waterfall', 'devops', 'ci/cd', 'tdd', 'bdd']
            },
            soft_skills: {
                communication: ['verbal communication', 'written communication', 'presentation', 'public speaking', 'active listening'],
                leadership: ['team leadership', 'project management', 'mentoring', 'decision making', 'strategic thinking'],
                interpersonal: ['teamwork', 'collaboration', 'conflict resolution', 'networking', 'empathy'],
                cognitive: ['problem solving', 'critical thinking', 'analytical thinking', 'creativity', 'innovation'],
                personal: ['time management', 'adaptability', 'self-motivation', 'attention to detail', 'resilience']
            }
        };

        // Sentiment analysis words
        this.sentimentWords = {
            positive: ['excellent', 'outstanding', 'exceptional', 'successful', 'innovative', 'efficient', 'effective', 'proven', 'expert', 'skilled'],
            negative: ['basic', 'limited', 'struggled', 'failed', 'poor', 'inadequate', 'insufficient', 'weak', 'below', 'minimal']
        };
    }

    // Enhanced text processing with synonym matching
    normalizeText(text) {
        return text.toLowerCase()
            .replace(/[^\w\s-]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    extractKeywords(text) {
        const normalized = this.normalizeText(text);
        const words = normalized.split(' ');
        const phrases = this.extractPhrases(normalized);

        // Combine words and phrases, filter out common words
        const stopWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'a', 'an']);

        const keywords = [...words, ...phrases]
            .filter(word => word.length > 2 && !stopWords.has(word))
            .reduce((acc, word) => {
                acc[word] = (acc[word] || 0) + 1;
                return acc;
            }, {});

        return keywords;
    }

    extractPhrases(text) {
        const phrases = [];
        const words = text.split(' ');

        // Extract 2-3 word phrases
        for (let i = 0; i < words.length - 1; i++) {
            phrases.push(words.slice(i, i + 2).join(' '));
            if (i < words.length - 2) {
                phrases.push(words.slice(i, i + 3).join(' '));
            }
        }

        return phrases;
    }

    // Enhanced matching with synonyms
    findMatches(jobKeywords, resumeKeywords) {
        const matches = new Set();
        const synonymMatches = new Set();

        // Direct matches
        Object.keys(jobKeywords).forEach(jobKeyword => {
            if (resumeKeywords[jobKeyword]) {
                matches.add(jobKeyword);
            }
        });

        // Synonym matches
        Object.keys(jobKeywords).forEach(jobKeyword => {
            if (!matches.has(jobKeyword)) {
                // Check if job keyword has synonyms
                const synonymList = this.synonyms[jobKeyword] || [];
                for (const synonym of synonymList) {
                    if (resumeKeywords[synonym]) {
                        synonymMatches.add(`${jobKeyword} (matched: ${synonym})`);
                        break;
                    }
                }

                // Check if resume keywords are synonyms of job keywords
                Object.keys(resumeKeywords).forEach(resumeKeyword => {
                    Object.entries(this.synonyms).forEach(([baseWord, syns]) => {
                        if (syns.includes(jobKeyword) && (resumeKeyword === baseWord || syns.includes(resumeKeyword))) {
                            synonymMatches.add(`${jobKeyword} (synonym match)`);
                        }
                    });
                });
            }
        });

        return {
            direct: Array.from(matches),
            synonym: Array.from(synonymMatches)
        };
    }

    // Enhanced role detection
    detectRole(jobDescription) {
        const text = this.normalizeText(jobDescription);
        const roleScores = {};

        Object.entries(this.roleTerminology).forEach(([role, terms]) => {
            let score = 0;
            terms.forEach(term => {
                if (text.includes(term)) {
                    score += 1;
                }
            });
            roleScores[role] = score;
        });

        const topRole = Object.entries(roleScores).reduce((a, b) =>
            roleScores[a[0]] > roleScores[b[0]] ? a : b
        );

        return {
            role: topRole[0],
            confidence: Math.min(topRole[1] / this.roleTerminology[topRole[0]].length, 1),
            allScores: roleScores
        };
    }

    // Enhanced skills analysis
    analyzeSkills(resumeText, jobText) {
        const resumeNormalized = this.normalizeText(resumeText);
        const jobNormalized = this.normalizeText(jobText);

        const analysis = {
            hard_skills: { found: [], missing: [], coverage: 0 },
            soft_skills: { found: [], missing: [], coverage: 0 }
        };

        ['hard_skills', 'soft_skills'].forEach(skillType => {
            const categories = this.skillsDatabase[skillType];
            let totalRequired = 0;
            let foundCount = 0;

            Object.entries(categories).forEach(([category, skills]) => {
                const requiredSkills = skills.filter(skill => jobNormalized.includes(skill));
                const foundSkills = skills.filter(skill => resumeNormalized.includes(skill));

                totalRequired += requiredSkills.length;
                foundCount += requiredSkills.filter(skill => foundSkills.includes(skill)).length;

                analysis[skillType].found.push(...foundSkills);
                analysis[skillType].missing.push(...requiredSkills.filter(skill => !foundSkills.includes(skill)));
            });

            analysis[skillType].coverage = totalRequired > 0 ? (foundCount / totalRequired) * 100 : 100;
            analysis[skillType].found = [...new Set(analysis[skillType].found)];
            analysis[skillType].missing = [...new Set(analysis[skillType].missing)];
        });

        return analysis;
    }

    analyzeResume() {
        const jobDescription = this.jobDescriptionTextarea.value.trim();
        const resumeText = this.resumeTextarea.value.trim();

        if (!jobDescription || !resumeText) {
            this.showError('Please enter both job description and resume text.');
            return;
        }

        this.showLoading();

        try {
            // Extract keywords and analyze
            const jobKeywords = this.extractKeywords(jobDescription);
            const resumeKeywords = this.extractKeywords(resumeText);
            const matches = this.findMatches(jobKeywords, resumeKeywords);
            const roleInfo = this.detectRole(jobDescription);
            const skillsAnalysis = this.analyzeSkills(resumeText, jobDescription);

            // Calculate enhanced metrics with improved algorithm
            const totalJobKeywords = Object.keys(jobKeywords).length;
            const totalMatches = matches.direct.length + matches.synonym.length;

                        // Analyze keyword frequency
            const keywordFrequency = this.analyzeKeywordFrequency(jobKeywords, resumeKeywords);

            // Calculate various scores first
            const scores = {
                ats: this.calculateATSScore(resumeText),
                actionWords: this.analyzeActionWords(resumeText),
                contactInfo: this.analyzeContactInfo(resumeText),
                structure: this.analyzeStructure(resumeText),
                experience: this.detectExperience(resumeText),
                industry: this.analyzeIndustryMatch(jobDescription, resumeText),
                sentiment: this.analyzeSentiment(resumeText),
                readability: this.analyzeReadability(resumeText),
                keywordDensity: this.analyzeKeywordDensity(resumeText, jobKeywords),
                competitiveAnalysis: this.performCompetitiveAnalysis(jobDescription, resumeText)
            };

            // Improved match score calculation
            const keywordMatchScore = totalJobKeywords > 0 ? (totalMatches / totalJobKeywords) * 100 : 0;
            const skillsScore = (skillsAnalysis.hard_skills.coverage + skillsAnalysis.soft_skills.coverage) / 2;
            const structureScore = this.calculateStructureScore(scores.structure);
            const atsScore = scores.ats.score;

            // Enhanced composite score with minimum baseline
            const baselineScore = 20; // Everyone starts with 20 points
            const weightedScore =
                (keywordMatchScore * 0.35) +    // 35% keyword matching
                (skillsScore * 0.25) +          // 25% skills coverage
                (structureScore * 0.2) +        // 20% structure quality
                (atsScore * 0.15) +             // 15% ATS compatibility
                (scores.sentiment.score * 0.05); // 5% sentiment bonus

            const matchScore = Math.min(100, Math.round(baselineScore + (weightedScore * 0.8)));

            this.displayResults({
                matchScore,
                matches,
                roleInfo,
                skillsAnalysis,
                keywordFrequency,
                scores,
                jobKeywords,
                resumeKeywords
            });

        } catch (error) {
            console.error('Analysis error:', error);
            this.showError('An error occurred during analysis. Please try again.');
        }
    }

    analyzeKeywordFrequency(jobKeywords, resumeKeywords) {
        const comparison = [];

        // Get top job keywords
        const sortedJobKeywords = Object.entries(jobKeywords)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 15);

        sortedJobKeywords.forEach(([keyword, jobFreq]) => {
            const resumeFreq = resumeKeywords[keyword] || 0;
            const ratio = jobFreq > 0 ? (resumeFreq / jobFreq) : 0;

            comparison.push({
                keyword,
                jobFreq,
                resumeFreq,
                ratio,
                status: ratio >= 1 ? 'optimal' : ratio >= 0.5 ? 'good' : 'low'
            });
        });

        return comparison;
    }

    calculateATSScore(resumeText) {
        let score = 100;
        const issues = [];

        // Check for ATS-unfriendly elements
        if (resumeText.includes('|') || resumeText.includes('•') || resumeText.includes('◦')) {
            score -= 10;
            issues.push('Special characters detected');
        }

        if (resumeText.length < 300) {
            score -= 20;
            issues.push('Resume too short');
        }

        if (!resumeText.match(/\b(experience|work|employment)\b/i)) {
            score -= 15;
            issues.push('Missing work experience section');
        }

        if (!resumeText.match(/\b(education|degree|university|college)\b/i)) {
            score -= 10;
            issues.push('Missing education section');
        }

        return { score: Math.max(score, 0), issues };
    }

    analyzeActionWords(resumeText) {
        const actionWords = [
            'achieved', 'developed', 'managed', 'led', 'created', 'implemented', 'improved',
            'designed', 'built', 'delivered', 'optimized', 'streamlined', 'collaborated',
            'coordinated', 'established', 'initiated', 'launched', 'mentored', 'negotiated'
        ];

        const found = [];
        const text = this.normalizeText(resumeText);

        actionWords.forEach(word => {
            if (text.includes(word)) {
                found.push(word);
            }
        });

        const strength = found.length >= 10 ? 'strong' : found.length >= 5 ? 'moderate' : 'weak';

        return { count: found.length, words: found, strength };
    }

    analyzeContactInfo(resumeText) {
        const checks = {
            email: /@/.test(resumeText),
            phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(resumeText),
            linkedin: /linkedin/i.test(resumeText),
            github: /github/i.test(resumeText),
            website: /\b(www\.|http|\.com|\.org|\.net)\b/i.test(resumeText)
        };

        const score = Object.values(checks).filter(Boolean).length;
        const completeness = Math.round((score / 5) * 100);

        return { checks, score, completeness };
    }

    analyzeStructure(resumeText) {
        const sections = {
            summary: /\b(summary|profile|objective)\b/i.test(resumeText),
            experience: /\b(experience|work|employment)\b/i.test(resumeText),
            education: /\b(education|degree)\b/i.test(resumeText),
            skills: /\b(skills|technologies)\b/i.test(resumeText)
        };

        const bulletPoints = (resumeText.match(/^[\s]*[-•*]/gm) || []).length;
        const dates = (resumeText.match(/\b(19|20)\d{2}\b/g) || []).length;

        const score = Object.values(sections).filter(Boolean).length;

        return {
            sections,
            bulletPoints,
            dates,
            organization: score >= 3 ? 'good' : 'needs improvement'
        };
    }

    detectExperience(resumeText) {
        const years = (resumeText.match(/\b(19|20)\d{2}\b/g) || []).length;
        const seniorTerms = ['senior', 'lead', 'principal', 'director', 'manager', 'head of'];
        const midTerms = ['developer', 'engineer', 'analyst', 'specialist'];

        const text = this.normalizeText(resumeText);
        const hasSeniorTerms = seniorTerms.some(term => text.includes(term));
        const hasMidTerms = midTerms.some(term => text.includes(term));

        let level = 'entry';
        if (years >= 6 || hasSeniorTerms) level = 'senior';
        else if (years >= 3 || hasMidTerms) level = 'mid';
        else if (years >= 1) level = 'junior';

        return { level, years, confidence: years > 0 ? 0.8 : 0.4 };
    }

    analyzeIndustryMatch(jobDescription, resumeText) {
        const industries = {
            technology: ['software', 'tech', 'programming', 'development', 'IT'],
            finance: ['finance', 'banking', 'investment', 'fintech', 'trading'],
            healthcare: ['healthcare', 'medical', 'hospital', 'clinical', 'pharma'],
            education: ['education', 'teaching', 'academic', 'university', 'school'],
            retail: ['retail', 'ecommerce', 'sales', 'customer', 'merchandise'],
            manufacturing: ['manufacturing', 'production', 'supply chain', 'operations'],
            consulting: ['consulting', 'advisory', 'strategy', 'transformation'],
            media: ['media', 'marketing', 'advertising', 'content', 'creative']
        };

        const jobText = this.normalizeText(jobDescription);
        const resumeText_norm = this.normalizeText(resumeText);

        const industryScores = {};

        Object.entries(industries).forEach(([industry, keywords]) => {
            let jobScore = 0;
            let resumeScore = 0;

            keywords.forEach(keyword => {
                if (jobText.includes(keyword)) jobScore++;
                if (resumeText_norm.includes(keyword)) resumeScore++;
            });

            industryScores[industry] = {
                job: jobScore,
                resume: resumeScore,
                match: Math.min(resumeScore / Math.max(jobScore, 1), 1)
            };
        });

        return industryScores;
    }

    // New Analytics Features
    analyzeSentiment(resumeText) {
        const text = this.normalizeText(resumeText);
        const words = text.split(' ');

        let positiveCount = 0;
        let negativeCount = 0;

        words.forEach(word => {
            if (this.sentimentWords.positive.includes(word)) {
                positiveCount++;
            } else if (this.sentimentWords.negative.includes(word)) {
                negativeCount++;
            }
        });

        const totalSentimentWords = positiveCount + negativeCount;
        const sentimentScore = totalSentimentWords > 0 ?
            Math.round(((positiveCount - negativeCount) / totalSentimentWords + 1) * 50) : 50;

        return {
            score: sentimentScore,
            positive: positiveCount,
            negative: negativeCount,
            tone: sentimentScore >= 70 ? 'positive' : sentimentScore >= 40 ? 'neutral' : 'negative'
        };
    }

        analyzeReadability(resumeText) {
        const sentences = resumeText.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const words = resumeText.split(/\s+/).filter(w => w.length > 0);

        if (sentences.length === 0 || words.length === 0) {
            return {
                score: 0,
                level: 'No content',
                avgSentenceLength: 0,
                avgSyllablesPerWord: 0,
                wordCount: 0,
                sentenceCount: 0
            };
        }

        const syllables = words.reduce((count, word) => {
            return count + this.countSyllables(word);
        }, 0);

        // Flesch Reading Ease Score
        const avgSentenceLength = words.length / sentences.length;
        const avgSyllablesPerWord = syllables / words.length;
        const fleschScore = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);

        // For professional documents, aim for 60-70 range (Standard to Fairly Easy)
        const readabilityLevel = fleschScore >= 90 ? 'Very Easy' :
                                fleschScore >= 80 ? 'Easy' :
                                fleschScore >= 70 ? 'Fairly Easy' :
                                fleschScore >= 60 ? 'Standard' :
                                fleschScore >= 50 ? 'Fairly Difficult' :
                                fleschScore >= 30 ? 'Difficult' : 'Very Difficult';

        // Normalize score for resume context (50-100 is good range)
        const normalizedScore = Math.max(0, Math.min(100, Math.round(fleschScore)));

        return {
            score: normalizedScore,
            level: readabilityLevel,
            avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
            avgSyllablesPerWord: Math.round(avgSyllablesPerWord * 100) / 100,
            wordCount: words.length,
            sentenceCount: sentences.length
        };
    }

    countSyllables(word) {
        word = word.toLowerCase();
        if (word.length <= 3) return 1;
        word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
        word = word.replace(/^y/, '');
        const matches = word.match(/[aeiouy]{1,2}/g);
        return matches ? matches.length : 1;
    }

        analyzeKeywordDensity(resumeText, jobKeywords) {
        const resumeWords = this.normalizeText(resumeText).split(' ');
        const totalWords = resumeWords.length;

        const densityAnalysis = Object.entries(jobKeywords)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([keyword, jobFreq]) => {
                const resumeFreq = resumeWords.filter(word => word === keyword).length;
                const density = (resumeFreq / totalWords) * 100;
                const optimalDensity = Math.min(2.5, Math.max(0.5, jobFreq * 0.3)); // More realistic optimal density

                return {
                    keyword,
                    density: Math.round(density * 1000) / 1000, // More precision
                    count: resumeFreq,
                    optimal: Math.round(optimalDensity * 1000) / 1000,
                    status: density >= optimalDensity * 0.7 ? 'optimal' :
                           density >= optimalDensity * 0.3 ? 'good' : 'low'
                };
            });

        const avgDensity = densityAnalysis.reduce((sum, item) => sum + item.density, 0) / densityAnalysis.length;
        const optimalCount = densityAnalysis.filter(item => item.status === 'optimal').length;
        const score = Math.min(100, (optimalCount / densityAnalysis.length) * 100);

        return {
            keywords: densityAnalysis,
            avgDensity: Math.round(avgDensity * 1000) / 1000,
            totalWords,
            score: Math.round(score)
        };
    }

    performCompetitiveAnalysis(jobDescription, resumeText) {
        const jobText = this.normalizeText(jobDescription);
        const resumeTextNorm = this.normalizeText(resumeText);

        // Analyze competitive keywords
        const competitiveTerms = [
            'award', 'recognition', 'top performer', 'exceeded', 'surpassed',
            'increased', 'reduced', 'saved', 'generated', 'revenue',
            'growth', 'improvement', 'efficiency', 'cost reduction',
            'team leader', 'mentor', 'trained', 'certified'
        ];

        const achievements = competitiveTerms.filter(term => resumeTextNorm.includes(term));

        // Quantifiable metrics detection
        const metrics = resumeText.match(/\d+%|\$[\d,]+|[\d,]+\+|[\d]+x|[\d]+ years?/g) || [];

        // Leadership indicators
        const leadershipTerms = ['led', 'managed', 'directed', 'supervised', 'coordinated'];
        const leadershipCount = leadershipTerms.filter(term => resumeTextNorm.includes(term)).length;

        const competitiveScore = Math.min(100,
            (achievements.length * 10) +
            (metrics.length * 5) +
            (leadershipCount * 8)
        );

        return {
            score: competitiveScore,
            achievements,
            metrics,
            leadershipIndicators: leadershipCount,
            strength: competitiveScore >= 70 ? 'strong' :
                     competitiveScore >= 40 ? 'moderate' : 'weak'
        };
    }

    displayResults(analysis) {
        const {
            matchScore,
            matches,
            roleInfo,
            skillsAnalysis,
            keywordFrequency,
            scores,
            jobKeywords,
            resumeKeywords
        } = analysis;

        // Update match score display
        const matchScoreElement = document.getElementById('matchScore');
        if (matchScoreElement) {
            matchScoreElement.querySelector('.score-value').textContent = `${matchScore}%`;
            matchScoreElement.className = `match-score ${this.getScoreClass(matchScore)}`;
        }

        // Generate strengths
        const strengths = [];
        if (matchScore >= 60) strengths.push(`Strong keyword match (${matchScore}%)`);
        if (scores.ats.score >= 80) strengths.push('ATS-friendly format');
        if (scores.actionWords.count >= 8) strengths.push(`Good use of action words (${scores.actionWords.count})`);
        if (scores.sentiment.score >= 70) strengths.push(`Positive tone (${scores.sentiment.tone})`);
        if (scores.competitiveAnalysis.score >= 60) strengths.push('Strong competitive positioning');

        // Generate weaknesses
        const weaknesses = [];
        if (matchScore < 40) weaknesses.push('Low keyword match - add more relevant keywords');
        if (scores.ats.score < 70) weaknesses.push('ATS compatibility issues detected');
        if (scores.actionWords.count < 5) weaknesses.push('Limited action words - use more dynamic verbs');
        if (scores.readability.score < 50) weaknesses.push('Text may be too complex - simplify language');
        if (scores.keywordDensity.score < 30) weaknesses.push('Low keyword density - increase relevant terms');

        // Generate suggestions
        const suggestions = [];
        suggestions.push(`Add these missing keywords: ${keywordFrequency.filter(k => k.status === 'low').slice(0,3).map(k => k.keyword).join(', ')}`);
        if (scores.contactInfo.completeness < 80) suggestions.push('Complete your contact information');
        if (scores.competitiveAnalysis.metrics.length < 3) suggestions.push('Add more quantifiable achievements');
        if (scores.sentiment.score < 50) suggestions.push('Use more positive, confident language');
        suggestions.push(`Target readability level: ${scores.readability.level === 'Very Difficult' ? 'Simplify language' : 'Good readability'}`);

        // Update result sections
        this.updateResultSection('strengthsList', strengths);
        this.updateResultSection('weaknessesList', weaknesses);
        this.updateResultSection('suggestionsList', suggestions);

        // Update analytics content with enhanced data
        const analyticsContent = document.getElementById('analyticsContent');
        if (analyticsContent) {
            analyticsContent.innerHTML = `
                <div class="analytics-section">
                    <h3>Performance Analytics</h3>
                    <div class="analytics-grid">
                        ${this.renderAnalyticsCard('ATS Score', scores.ats.score, '%', this.renderATSDetails(scores.ats))}
                        ${this.renderAnalyticsCard('Action Words', scores.actionWords.count, 'words', this.renderActionWordsDetails(scores.actionWords))}
                        ${this.renderAnalyticsCard('Contact Info', scores.contactInfo.completeness, '%', this.renderContactDetails(scores.contactInfo))}
                        ${this.renderAnalyticsCard('Structure', this.calculateStructureScore(scores.structure), '%', this.renderStructureDetails(scores.structure))}
                        ${this.renderAnalyticsCard('Sentiment', scores.sentiment.score, '%', this.renderSentimentDetails(scores.sentiment))}
                        ${this.renderAnalyticsCard('Readability', scores.readability.score, '/100', this.renderReadabilityDetails(scores.readability))}
                        ${this.renderAnalyticsCard('Keyword Density', Math.round(scores.keywordDensity.score), '%', this.renderKeywordDensityDetails(scores.keywordDensity))}
                        ${this.renderAnalyticsCard('Competitive Edge', scores.competitiveAnalysis.score, '%', this.renderCompetitiveDetails(scores.competitiveAnalysis))}
                    </div>
                </div>
                <div class="analytics-section">
                    <h3>Match Analysis</h3>
                    <div class="analytics-grid">
                        ${this.renderKeywordFrequencyCard(keywordFrequency)}
                        ${this.renderRoleMatchCard(roleInfo)}
                        ${this.renderSkillsAnalysisCard(skillsAnalysis)}
                        ${this.renderIndustryMatchCard(scores.industry)}
                    </div>
                </div>
                <div class="analytics-section">
                    <h3>Details</h3>
                    <div class="sections-grid">
                        <div class="analysis-section">
                            <h4>Keyword Matches</h4>
                            <div class="section-content">
                                <div class="match-stats">
                                    <div class="stat-item">
                                        <span class="stat-value">${matches.direct.length}</span>
                                        <span class="stat-label">Direct</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-value">${matches.synonym.length}</span>
                                        <span class="stat-label">Synonym</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-value">${matches.direct.length + matches.synonym.length}</span>
                                        <span class="stat-label">Total</span>
                                    </div>
                                </div>
                                <div class="keyword-tags">
                                    ${matches.direct.slice(0, 6).map(keyword => `<span class="keyword-tag direct">${keyword}</span>`).join('')}
                                    ${matches.synonym.slice(0, 6).map(keyword => `<span class="keyword-tag synonym">${keyword.split('(')[0].trim()}</span>`).join('')}
                                </div>
                            </div>
                        </div>
                        <div class="analysis-section">
                            <h4>Top Keywords</h4>
                            <div class="section-content">
                                <div class="keyword-list">
                                    ${keywordFrequency.slice(0, 5).map(item => `
                                        <div class="keyword-item">
                                            <span class="keyword">${item.keyword}</span>
                                            <span class="status ${item.status}">${item.status}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                        <div class="analysis-section">
                            <h4>Industry Fit</h4>
                            <div class="section-content">
                                <div class="industry-list">
                                    ${Object.entries(scores.industry)
                                        .sort(([,a], [,b]) => b.match - a.match)
                                        .slice(0, 3)
                                        .map(([industry, data]) => `
                                        <div class="industry-item">
                                            <span class="industry-name">${industry}</span>
                                            <span class="industry-score">${Math.round(data.match * 100)}%</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                        <div class="analysis-section">
                            <h4>Skills</h4>
                            <div class="section-content">
                                <div class="skills-summary">
                                    <div class="skill-item">
                                        <span>Hard Skills</span>
                                        <span>${Math.round(skillsAnalysis.hard_skills.coverage)}%</span>
                                    </div>
                                    <div class="skill-item">
                                        <span>Soft Skills</span>
                                        <span>${Math.round(skillsAnalysis.soft_skills.coverage)}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        // Hide loading and show results
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }

        this.resultContainer.style.display = 'block';
        this.resultContainer.scrollIntoView({ behavior: 'smooth' });
    }

    updateResultSection(elementId, items) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = items.map(item => `<li>${item}</li>`).join('');
        }
    }

    renderAnalyticsCard(title, value, unit, details) {
        const scoreClass = this.getScoreClass(value);
        return `
            <div class="analytics-card">
                <div class="card-header">
                    <h3>${title}</h3>
                    <div class="score ${scoreClass}">${value}<span class="unit">${unit}</span></div>
                </div>
                <div class="card-details">${details}</div>
            </div>
        `;
    }

    renderATSDetails(ats) {
        return `
            <div class="ats-details">
                ${ats.issues.length > 0 ?
                    `<div class="issues">Issues: ${ats.issues.join(', ')}</div>` :
                    '<div class="success">✅ ATS-friendly format detected</div>'
                }
            </div>
        `;
    }

    renderActionWordsDetails(actionWords) {
        return `
            <div class="action-words">
                <div class="strength ${actionWords.strength}">${actionWords.strength.toUpperCase()}</div>
                <div class="words-preview">${actionWords.words.slice(0, 4).join(', ')}${actionWords.words.length > 4 ? ', ...' : ''}</div>
            </div>
        `;
    }

    renderContactDetails(contact) {
        return `
            <div class="contact-checks">
                ${Object.entries(contact.checks).map(([type, found]) =>
                    `<span class="check ${found ? 'found' : 'missing'}">${type} ${found ? '✓' : '✗'}</span>`
                ).join(' ')}
            </div>
        `;
    }

    renderStructureDetails(structure) {
        return `
            <div class="structure-info">
                <div>Sections: ${Object.values(structure.sections).filter(Boolean).length}/4</div>
                <div>Bullet points: ${structure.bulletPoints}</div>
                <div>Dates: ${structure.dates}</div>
            </div>
        `;
    }

    renderKeywordFrequencyCard(frequency) {
        const avgRatio = frequency.reduce((sum, item) => sum + item.ratio, 0) / frequency.length;
        return this.renderAnalyticsCard(
            'Keyword Frequency',
            Math.round(avgRatio * 100),
            '%',
            `<div>Optimal keywords: ${frequency.filter(f => f.status === 'optimal').length}</div>`
        );
    }

    renderRoleMatchCard(roleInfo) {
        return this.renderAnalyticsCard(
            'Role Detection',
            Math.round(roleInfo.confidence * 100),
            '%',
            `<div class="role-info">
                <div>Detected: ${roleInfo.role}</div>
                <div>Confidence: ${roleInfo.confidence.toFixed(2)}</div>
            </div>`
        );
    }

    renderSkillsAnalysisCard(skills) {
        const overallCoverage = (skills.hard_skills.coverage + skills.soft_skills.coverage) / 2;
        return this.renderAnalyticsCard(
            'Skills Coverage',
            Math.round(overallCoverage),
            '%',
            `<div class="skills-breakdown">
                <div>Hard Skills: ${Math.round(skills.hard_skills.coverage)}%</div>
                <div>Soft Skills: ${Math.round(skills.soft_skills.coverage)}%</div>
            </div>`
        );
    }

    renderSentimentDetails(sentiment) {
        return `
            <div class="sentiment-details">
                <div class="tone ${sentiment.tone}">${sentiment.tone.toUpperCase()}</div>
                <div class="sentiment-breakdown">
                    <span class="positive">+${sentiment.positive}</span>
                    <span class="negative">-${sentiment.negative}</span>
                </div>
            </div>
        `;
    }

    renderReadabilityDetails(readability) {
        return `
            <div class="readability-details">
                <div class="level">${readability.level}</div>
                <div class="stats">
                    <div>Words: ${readability.wordCount}</div>
                    <div>Avg sentence: ${readability.avgSentenceLength} words</div>
                </div>
            </div>
        `;
    }

    renderKeywordDensityDetails(density) {
        return `
            <div class="density-details">
                <div class="avg-density">${density.avgDensity}% avg</div>
                <div class="word-count">${density.totalWords} total words</div>
                <div class="optimal-count">
                    ${density.keywords.filter(k => k.status === 'optimal').length}/${density.keywords.length} optimal
                </div>
            </div>
        `;
    }

    renderCompetitiveDetails(competitive) {
        return `
            <div class="competitive-details">
                <div class="strength ${competitive.strength}">${competitive.strength.toUpperCase()}</div>
                <div class="competitive-stats">
                    <div>Achievements: ${competitive.achievements.length}</div>
                    <div>Metrics: ${competitive.metrics.length}</div>
                    <div>Leadership: ${competitive.leadershipIndicators}</div>
                </div>
            </div>
        `;
    }

    calculateStructureScore(structure) {
        const sectionCount = Object.values(structure.sections).filter(Boolean).length;
        const baseScore = (sectionCount / 4) * 60; // Max 60 points for sections
        const bulletBonus = Math.min(structure.bulletPoints * 2, 20); // Max 20 points for bullets
        const dateBonus = Math.min(structure.dates * 3, 20); // Max 20 points for dates
        return Math.round(baseScore + bulletBonus + dateBonus);
    }

    renderIndustryMatchCard(industryScores) {
        const topIndustry = Object.entries(industryScores)
            .sort(([,a], [,b]) => b.match - a.match)[0];

        const score = Math.round(topIndustry[1].match * 100);
        return this.renderAnalyticsCard(
            'Industry Match',
            score,
            '%',
            `<div class="industry-match-info">
                <div class="top-industry">${topIndustry[0]}</div>
                <div class="match-strength">${score >= 70 ? 'Strong' : score >= 50 ? 'Good' : 'Weak'} alignment</div>
            </div>`
        );
    }

    getScoreClass(score) {
        if (score >= 80) return 'excellent';
        if (score >= 60) return 'good';
        if (score >= 40) return 'fair';
        return 'poor';
    }

    showLoading() {
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'block';
            loadingElement.querySelector('p').textContent = 'Analyzing resume with enhanced NLP processing...';
        }
        this.resultContainer.style.display = 'none';
    }

    showError(message) {
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }

        const analyticsContent = document.getElementById('analyticsContent');
        if (analyticsContent) {
            analyticsContent.innerHTML = `
                <div class="error-container">
                    <div class="error-icon">⚠️</div>
                    <h3>Analysis Error</h3>
                    <p>${message}</p>
                </div>
            `;
        }
        this.resultContainer.style.display = 'block';
    }

    clearFields() {
        if (confirm('Are you sure you want to clear all fields?')) {
            this.jobDescriptionTextarea.value = '';
            this.resumeTextarea.value = '';
            this.resultContainer.style.display = 'none';

            // Clear all result sections
            const strengthsList = document.getElementById('strengthsList');
            const weaknessesList = document.getElementById('weaknessesList');
            const suggestionsList = document.getElementById('suggestionsList');
            const analyticsContent = document.getElementById('analyticsContent');
            const matchScore = document.getElementById('matchScore');

            if (strengthsList) strengthsList.innerHTML = '';
            if (weaknessesList) weaknessesList.innerHTML = '';
            if (suggestionsList) suggestionsList.innerHTML = '';
            if (analyticsContent) analyticsContent.innerHTML = '';
            if (matchScore) {
                matchScore.querySelector('.score-value').textContent = '0%';
                matchScore.className = 'match-score poor';
            }
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
    }

    updateThemeIcon(theme) {
        this.themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
        this.themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ResumeAnalyzer();
});
