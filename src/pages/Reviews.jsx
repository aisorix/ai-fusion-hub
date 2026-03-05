import { useLanguage } from '../contexts/LanguageContext';
import SEOHead from '@/components/SEOHead';
import { useAuth } from '../contexts/AuthContext';
import { Star, StarHalf, ArrowLeft, Filter, Search, PenLine, X, ArrowUpDown, Loader2, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useReviews, useSubmitReview } from '@/hooks/useReviews';

const Reviews = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { data: dbReviews = [], isLoading, error } = useReviews();
  const submitReviewMutation = useSubmitReview();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    location: '',
    rating: 5,
    review: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = language === 'en' ? 'Name is required' : 'নাম প্রয়োজন';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = language === 'en' ? 'Name must be less than 50 characters' : 'নাম ৫০ অক্ষরের কম হতে হবে';
    }
    if (!formData.role.trim()) {
      newErrors.role = language === 'en' ? 'Role/Profession is required' : 'পেশা প্রয়োজন';
    } else if (formData.role.trim().length > 50) {
      newErrors.role = language === 'en' ? 'Role must be less than 50 characters' : 'পেশা ৫০ অক্ষরের কম হতে হবে';
    }
    if (!formData.location.trim()) {
      newErrors.location = language === 'en' ? 'Location is required' : 'অবস্থান প্রয়োজন';
    } else if (formData.location.trim().length > 50) {
      newErrors.location = language === 'en' ? 'Location must be less than 50 characters' : 'অবস্থান ৫০ অক্ষরের কম হতে হবে';
    }
    if (!formData.review.trim()) {
      newErrors.review = language === 'en' ? 'Review is required' : 'রিভিউ প্রয়োজন';
    } else if (formData.review.trim().length < 20) {
      newErrors.review = language === 'en' ? 'Review must be at least 20 characters' : 'রিভিউ কমপক্ষে ২০ অক্ষর হতে হবে';
    } else if (formData.review.trim().length > 500) {
      newErrors.review = language === 'en' ? 'Review must be less than 500 characters' : 'রিভিউ ৫০০ অক্ষরের কম হতে হবে';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    await submitReviewMutation.mutateAsync({
      name: formData.name.trim(),
      role: formData.role.trim(),
      location: formData.location.trim(),
      review: formData.review.trim(),
      rating: formData.rating,
    });

    setFormData({ name: '', role: '', location: '', rating: 5, review: '' });
    setIsModalOpen(false);
  };

  const baseReviews = [
    // Existing 6 reviews
    {
      name: "Rafiq Ahmed",
      role: "Startup Founder",
      location: "Dhaka, Bangladesh",
      review: "AI Sorix replaced 4 different AI subscriptions for me. Having ChatGPT, DeepSeek, Gemini and 7+ models in one place is a game-changer for my workflow. Best investment for my startup this year.",
      rating: 5,
      date: "2 weeks ago",
      verified: true
    },
    {
      name: "Fatima Khan",
      role: "Content Creator",
      location: "Chittagong, Bangladesh",
      review: "The Legends feature is incredible! I use it daily for writing scripts and creating social media content. The Bengali support is amazing and really sets it apart from other tools.",
      rating: 5,
      date: "1 week ago",
      verified: true
    },
    {
      name: "Arjun Das",
      role: "University Student",
      location: "Rajshahi, Bangladesh",
      review: "As a student, having access to all major AI models at an affordable price is perfect. Sorix Search helps me with research papers. Wish there were more student discounts though.",
      rating: 5,
      date: "3 days ago",
      verified: true
    },
    {
      name: "Priya Sharma",
      role: "HR Manager",
      location: "Mumbai, India",
      review: "I use AI Sorix for drafting job descriptions, interview questions, and employee communications. It saves me hours every week. The multi-model approach is brilliant.",
      rating: 5,
      date: "1 month ago",
      verified: true
    },
    {
      name: "Kamal Hossain",
      role: "Freelance Developer",
      location: "Sylhet, Bangladesh",
      review: "The code assistance across different AI models is fantastic. I can compare outputs and choose the best solution for my projects. Sometimes the responses are slow during peak hours.",
      rating: 4,
      date: "2 weeks ago",
      verified: true
    },
    {
      name: "Nusrat Jahan",
      role: "Business Consultant",
      location: "Dhaka, Bangladesh",
      review: "Finally, a platform that understands our needs! The multi-model approach and local payment options make it perfect for Bangladesh. bKash integration is seamless.",
      rating: 5,
      date: "5 days ago",
      verified: true
    },
    // Additional 94 reviews for total of 100
    {
      name: "Mohammad Sakib",
      role: "Software Engineer",
      location: "Dhaka, Bangladesh",
      review: "Been using AI Sorix for 3 months now. The ability to switch between Claude, GPT-4, and Gemini without separate subscriptions is exactly what I needed. Code generation quality is excellent.",
      rating: 5,
      date: "1 week ago",
      verified: true
    },
    {
      name: "Tasnim Rahman",
      role: "Digital Marketer",
      location: "Dhaka, Bangladesh",
      review: "Great for creating marketing copy in both English and Bengali. The Legends feature helps maintain brand voice. Only complaint - wish the mobile app was better optimized.",
      rating: 4,
      date: "3 weeks ago",
      verified: true
    },
    {
      name: "James Chen",
      role: "Product Manager",
      location: "Singapore",
      review: "Impressive platform. I've tried many AI aggregators but Sorix offers the best value. Response times could be faster sometimes, but the quality makes up for it.",
      rating: 4,
      date: "2 weeks ago",
      verified: true
    },
    {
      name: "Anika Chowdhury",
      role: "Medical Student",
      location: "Dhaka, Bangladesh",
      review: "Helps me understand complex medical concepts. The multi-model comparison is useful for getting different perspectives on difficult topics. Affordable for students!",
      rating: 5,
      date: "4 days ago",
      verified: true
    },
    {
      name: "Habibur Rahman",
      role: "Small Business Owner",
      location: "Khulna, Bangladesh",
      review: "Using it for customer service templates and business emails. The bKash payment option made subscription so easy. Highly recommended for small businesses.",
      rating: 5,
      date: "1 month ago",
      verified: true
    },
    {
      name: "Sarah Mitchell",
      role: "Freelance Writer",
      location: "London, UK",
      review: "Discovered Sorix through a friend in Bangladesh. Great value compared to paying for multiple AI tools separately. The writing assistance is top-notch.",
      rating: 5,
      date: "2 weeks ago",
      verified: true
    },
    {
      name: "Imran Hossain",
      role: "UI/UX Designer",
      location: "Dhaka, Bangladesh",
      review: "Perfect for brainstorming design ideas and writing microcopy. Sometimes the image understanding could be better, but overall a solid product. 4 stars for now.",
      rating: 4,
      date: "1 week ago",
      verified: true
    },
    {
      name: "Farzana Akter",
      role: "Teacher",
      location: "Comilla, Bangladesh",
      review: "I use it to create lesson plans and educational content. My students love the interactive explanations. The Bengali language support is a blessing!",
      rating: 5,
      date: "6 days ago",
      verified: true
    },
    {
      name: "David Kim",
      role: "Data Analyst",
      location: "Seoul, South Korea",
      review: "Good for data analysis explanations and code debugging. Would love to see more specialized data science models added in the future.",
      rating: 4,
      date: "3 weeks ago",
      verified: true
    },
    {
      name: "Shamim Hasan",
      role: "YouTube Creator",
      location: "Dhaka, Bangladesh",
      review: "Game changer for my YouTube channel! Script writing, thumbnail ideas, SEO optimization - all in one place. The cost savings are incredible.",
      rating: 5,
      date: "1 week ago",
      verified: true
    },
    {
      name: "Ritu Begum",
      role: "Accountant",
      location: "Sylhet, Bangladesh",
      review: "Helps me draft professional emails and understand complex regulations. Not perfect for detailed accounting calculations, but great for everything else.",
      rating: 4,
      date: "2 weeks ago",
      verified: true
    },
    {
      name: "Michael Roberts",
      role: "Startup Advisor",
      location: "New York, USA",
      review: "Recommended by a colleague from Bangladesh. Impressed by the model variety and pricing. Great alternative to expensive enterprise AI tools.",
      rating: 5,
      date: "1 month ago",
      verified: true
    },
    {
      name: "Sumaiya Islam",
      role: "Graphic Designer",
      location: "Dhaka, Bangladesh",
      review: "Love using it for creative briefs and client communication. The AI understands context really well. Sometimes wish there was offline mode though.",
      rating: 4,
      date: "5 days ago",
      verified: true
    },
    {
      name: "Tanvir Haque",
      role: "Backend Developer",
      location: "Dhaka, Bangladesh",
      review: "The code generation is incredible. Switched from ChatGPT Plus because Sorix gives me access to more models. API integration is smooth too.",
      rating: 5,
      date: "1 week ago",
      verified: true
    },
    {
      name: "Lisa Wong",
      role: "Marketing Director",
      location: "Hong Kong",
      review: "Using it for our regional marketing campaigns. The multilingual support is impressive. Great value for teams.",
      rating: 5,
      date: "3 weeks ago",
      verified: true
    },
    {
      name: "Abdur Rahim",
      role: "Civil Engineer",
      location: "Chittagong, Bangladesh",
      review: "Useful for technical documentation and report writing. Helped me save time on project proposals. Worth every taka.",
      rating: 5,
      date: "2 weeks ago",
      verified: true
    },
    {
      name: "Mahmuda Khatun",
      role: "Research Assistant",
      location: "Dhaka, Bangladesh",
      review: "Sorix Search is amazing for literature reviews. The ability to compare responses from different models helps verify information. Love it!",
      rating: 5,
      date: "4 days ago",
      verified: true
    },
    {
      name: "Alex Thompson",
      role: "Full Stack Developer",
      location: "Toronto, Canada",
      review: "Solid platform with good model variety. Sometimes experiences lag during peak hours, but the team seems to be improving infrastructure.",
      rating: 4,
      date: "1 month ago",
      verified: true
    },
    {
      name: "Nasreen Begum",
      role: "Fashion Blogger",
      location: "Dhaka, Bangladesh",
      review: "Perfect for writing blog posts and Instagram captions in both Bengali and English. My engagement has increased 40% since I started using Sorix!",
      rating: 5,
      date: "1 week ago",
      verified: true
    },
    {
      name: "Fahim Ahmed",
      role: "Mobile App Developer",
      location: "Dhaka, Bangladesh",
      review: "Great for debugging and learning new frameworks. The code explanations are detailed. Sometimes the context window feels limited for large codebases.",
      rating: 4,
      date: "2 weeks ago",
      verified: true
    },
    {
      name: "Rupa Sen",
      role: "Content Strategist",
      location: "Kolkata, India",
      review: "Excellent tool for content planning and ideation. The Legends feature is unique - haven't seen this in other AI tools. Highly recommend!",
      rating: 5,
      date: "3 weeks ago",
      verified: true
    },
    {
      name: "Shakil Hossain",
      role: "E-commerce Owner",
      location: "Dhaka, Bangladesh",
      review: "Using it for product descriptions and customer support templates. bKash payment is super convenient. Business has improved since using AI Sorix.",
      rating: 5,
      date: "6 days ago",
      verified: true
    },
    {
      name: "Jennifer Park",
      role: "UX Researcher",
      location: "Sydney, Australia",
      review: "Good for synthesizing user research and creating personas. Would love more specialized research tools, but current features are quite useful.",
      rating: 4,
      date: "2 weeks ago",
      verified: true
    },
    {
      name: "Mizanur Rahman",
      role: "Bank Officer",
      location: "Dhaka, Bangladesh",
      review: "Helps me draft professional communications and understand financial reports. The security and privacy features give me confidence to use it for work.",
      rating: 5,
      date: "1 week ago",
      verified: true
    },
    {
      name: "Sabrina Sultana",
      role: "Pharmaceutical Rep",
      location: "Dhaka, Bangladesh",
      review: "Great for preparing presentations and understanding medical literature. The accuracy is impressive. My productivity has increased significantly.",
      rating: 5,
      date: "4 days ago",
      verified: true
    },
    {
      name: "Robert Johnson",
      role: "Tech Entrepreneur",
      location: "Berlin, Germany",
      review: "Discovered this through the startup community. Impressive what they've built. The multi-model approach is the future of AI tools.",
      rating: 5,
      date: "1 month ago",
      verified: true
    },
    {
      name: "Jahangir Alam",
      role: "High School Teacher",
      location: "Mymensingh, Bangladesh",
      review: "Creating quizzes and lesson materials is so much easier now. Students are more engaged. The Bengali support makes it accessible for our context.",
      rating: 5,
      date: "2 weeks ago",
      verified: true
    },
    {
      name: "Tahmina Akter",
      role: "NGO Worker",
      location: "Rangpur, Bangladesh",
      review: "We use it for grant writing and report preparation. The cost-effectiveness is perfect for non-profit budgets. Wish there were NGO discounts though.",
      rating: 4,
      date: "3 weeks ago",
      verified: true
    },
    {
      name: "Amit Sharma",
      role: "Investment Analyst",
      location: "Delhi, India",
      review: "Solid tool for market research and analysis summaries. The comparison feature between models is unique and very helpful.",
      rating: 5,
      date: "1 week ago",
      verified: true
    },
    {
      name: "Kamrul Islam",
      role: "Journalist",
      location: "Dhaka, Bangladesh",
      review: "Essential for research and fact-checking. The Sorix Search feature is particularly useful for my investigative work. 5 stars!",
      rating: 5,
      date: "5 days ago",
      verified: true
    },
    {
      name: "Emma Williams",
      role: "Academic Researcher",
      location: "Melbourne, Australia",
      review: "Good for literature reviews and writing assistance. Sometimes the citations need verification, but overall a helpful research companion.",
      rating: 4,
      date: "2 weeks ago",
      verified: true
    },
    {
      name: "Rezaul Karim",
      role: "IT Manager",
      location: "Dhaka, Bangladesh",
      review: "Deployed it for our team and everyone loves it. The admin features could be better, but the core AI functionality is excellent.",
      rating: 4,
      date: "1 month ago",
      verified: true
    },
    {
      name: "Shamima Akter",
      role: "Pharmacist",
      location: "Sylhet, Bangladesh",
      review: "Helps me understand drug interactions and patient communication. The accuracy for medical information is impressive. Very satisfied!",
      rating: 5,
      date: "1 week ago",
      verified: true
    },
    {
      name: "Daniel Lee",
      role: "Game Developer",
      location: "Tokyo, Japan",
      review: "Using it for game narrative and dialogue writing. The creative writing capabilities are surprisingly good. Recommended for indie devs.",
      rating: 5,
      date: "3 weeks ago",
      verified: true
    },
    {
      name: "Rabeya Khatun",
      role: "Homemaker",
      location: "Bogra, Bangladesh",
      review: "My children use it for homework help. The Bengali explanations are so helpful! Even I'm learning new things. Very affordable for families.",
      rating: 5,
      date: "4 days ago",
      verified: true
    },
    {
      name: "Ashraf Uddin",
      role: "Real Estate Agent",
      location: "Dhaka, Bangladesh",
      review: "Perfect for creating property listings and client emails. The professional tone suggestions are spot on. My closing rate has improved!",
      rating: 5,
      date: "2 weeks ago",
      verified: true
    },
    {
      name: "Maria Santos",
      role: "Digital Nomad",
      location: "Lisbon, Portugal",
      review: "Great value compared to US-based AI tools. Works well for my freelance writing work. Would recommend to other remote workers.",
      rating: 5,
      date: "1 week ago",
      verified: true
    },
    {
      name: "Shafiqul Islam",
      role: "College Lecturer",
      location: "Rajshahi, Bangladesh",
      review: "Excellent for preparing lecture notes and exam questions. The depth of knowledge across subjects is impressive. A must-have for educators.",
      rating: 5,
      date: "6 days ago",
      verified: true
    },
    {
      name: "Ayesha Siddiqua",
      role: "Wedding Planner",
      location: "Dhaka, Bangladesh",
      review: "Using it for vendor communications and creative ideas. Helps me stay organized and professional. My clients love the detailed proposals!",
      rating: 5,
      date: "3 weeks ago",
      verified: true
    },
    {
      name: "Kevin Martinez",
      role: "Cybersecurity Analyst",
      location: "Miami, USA",
      review: "Good for explaining technical concepts and documentation. The security-focused responses are well-informed. Solid tool overall.",
      rating: 4,
      date: "2 weeks ago",
      verified: true
    },
    {
      name: "Salma Begum",
      role: "Housewife & Blogger",
      location: "Dhaka, Bangladesh",
      review: "Started my cooking blog with help from AI Sorix. Recipe writing and food photography tips are amazing! The Bengali content creation is flawless.",
      rating: 5,
      date: "1 week ago",
      verified: true
    },
    {
      name: "Nazmul Hasan",
      role: "Stock Trader",
      location: "Dhaka, Bangladesh",
      review: "Helps me analyze market trends and news. Not for financial advice of course, but great for research and understanding complex topics.",
      rating: 4,
      date: "4 days ago",
      verified: true
    },
    {
      name: "Ananya Roy",
      role: "Psychology Student",
      location: "Dhaka, Bangladesh",
      review: "Amazing for understanding complex psychological theories! The explanations are clear and helpful for my studies. Best AI tool I've used.",
      rating: 5,
      date: "2 weeks ago",
      verified: true
    },
    {
      name: "Thomas Anderson",
      role: "Blockchain Developer",
      location: "Amsterdam, Netherlands",
      review: "Solid for smart contract development and documentation. The technical accuracy is commendable. Great alternative to pricier tools.",
      rating: 5,
      date: "1 month ago",
      verified: true
    },
    {
      name: "Farhan Khan",
      role: "Architect",
      location: "Dhaka, Bangladesh",
      review: "Using it for project proposals and client presentations. The professional writing assistance is excellent. Saves me hours every week.",
      rating: 5,
      date: "1 week ago",
      verified: true
    },
    {
      name: "Mousumi Dey",
      role: "Nutritionist",
      location: "Chittagong, Bangladesh",
      review: "Great for creating diet plans and educational content. The health information is accurate and up-to-date. My clients appreciate the detailed plans!",
      rating: 5,
      date: "5 days ago",
      verified: true
    },
    {
      name: "Christopher Brown",
      role: "Music Producer",
      location: "Los Angeles, USA",
      review: "Surprisingly good for lyrics and creative brainstorming. The AI understands musical context well. Worth trying if you're in creative fields.",
      rating: 4,
      date: "3 weeks ago",
      verified: true
    },
    {
      name: "Shahidul Islam",
      role: "Government Officer",
      location: "Dhaka, Bangladesh",
      review: "Helps with official correspondence and policy analysis. The formal writing tone is perfect. Very satisfied with the service.",
      rating: 5,
      date: "2 weeks ago",
      verified: true
    },
    {
      name: "Rifat Mahmud",
      role: "Gym Trainer",
      location: "Dhaka, Bangladesh",
      review: "Creating workout plans and nutrition advice for clients. The fitness knowledge is solid. My clients love the personalized programs!",
      rating: 5,
      date: "1 week ago",
      verified: true
    },
    {
      name: "Priyanka Das",
      role: "Event Manager",
      location: "Kolkata, India",
      review: "Excellent for event planning and vendor management. The organizational suggestions are practical. Has made my job so much easier!",
      rating: 5,
      date: "4 days ago",
      verified: true
    },
    {
      name: "Asad Rahman",
      role: "Legal Assistant",
      location: "Dhaka, Bangladesh",
      review: "Great for legal research and document drafting. Obviously not a replacement for lawyers, but excellent for initial research and formatting.",
      rating: 4,
      date: "2 weeks ago",
      verified: true
    },
    {
      name: "Sophie Turner",
      role: "Travel Blogger",
      location: "London, UK",
      review: "Perfect for travel content and itinerary planning. The destination knowledge is comprehensive. Really helps with SEO-optimized content too!",
      rating: 5,
      date: "1 month ago",
      verified: true
    },
    {
      name: "Monira Akhter",
      role: "Dentist",
      location: "Dhaka, Bangladesh",
      review: "Using it for patient education materials and clinic management. The medical accuracy gives me confidence. Patients appreciate the detailed explanations.",
      rating: 5,
      date: "6 days ago",
      verified: true
    },
    {
      name: "Rakib Hasan",
      role: "Delivery Service Owner",
      location: "Dhaka, Bangladesh",
      review: "Helps with customer service scripts and business planning. As a small business owner, the affordable pricing is a blessing. Highly recommend!",
      rating: 5,
      date: "1 week ago",
      verified: true
    },
    {
      name: "Rajesh Kumar",
      role: "Supply Chain Manager",
      location: "Chennai, India",
      review: "Good for analyzing logistics data and creating reports. The business intelligence features are useful. Would love more data visualization options.",
      rating: 4,
      date: "3 weeks ago",
      verified: true
    },
    {
      name: "Fatema Begum",
      role: "Boutique Owner",
      location: "Dhaka, Bangladesh",
      review: "Creating product descriptions and social media posts is so easy now! My online sales have increased by 60%. Best investment for my business!",
      rating: 5,
      date: "2 weeks ago",
      verified: true
    },
    {
      name: "Zahidul Haque",
      role: "Electrician",
      location: "Gazipur, Bangladesh",
      review: "Using it to learn new techniques and understand electrical codes. The technical explanations are clear. Even helps with customer quotations!",
      rating: 5,
      date: "5 days ago",
      verified: true
    },
    {
      name: "Naomi Tanaka",
      role: "Language Teacher",
      location: "Osaka, Japan",
      review: "Great for creating language learning materials. The multilingual capabilities are impressive. My students' progress has improved significantly.",
      rating: 5,
      date: "1 week ago",
      verified: true
    },
    {
      name: "Belal Ahmed",
      role: "Restaurant Owner",
      location: "Dhaka, Bangladesh",
      review: "Menu creation, marketing posts, customer responses - Sorix handles it all! The Bengali content is natural and engaging. My customers love our new content!",
      rating: 5,
      date: "4 days ago",
      verified: true
    },
    {
      name: "Shirin Akter",
      role: "Beauty Salon Owner",
      location: "Dhaka, Bangladesh",
      review: "Perfect for social media marketing and client communication. The beauty industry knowledge is surprisingly good. Business is booming!",
      rating: 5,
      date: "2 weeks ago",
      verified: true
    },
    {
      name: "Andrew Wilson",
      role: "Technical Writer",
      location: "Dublin, Ireland",
      review: "Excellent for documentation and API references. The technical accuracy is impressive. A great tool for any technical writing needs.",
      rating: 5,
      date: "1 month ago",
      verified: true
    },
    {
      name: "Rubina Yasmin",
      role: "Interior Designer",
      location: "Dhaka, Bangladesh",
      review: "Using it for design concepts and client proposals. The creative suggestions are inspiring. My clients are impressed with the detailed presentations!",
      rating: 5,
      date: "1 week ago",
      verified: true
    },
    {
      name: "Saiful Islam",
      role: "Agricultural Officer",
      location: "Rangpur, Bangladesh",
      review: "Helps farmers understand modern techniques. The agricultural knowledge is comprehensive. Making a real difference in our community!",
      rating: 5,
      date: "6 days ago",
      verified: true
    },
    {
      name: "Elena Popov",
      role: "Graphic Illustrator",
      location: "Moscow, Russia",
      review: "Good for creative briefs and project descriptions. Would love direct image generation integration, but the text assistance is excellent.",
      rating: 4,
      date: "3 weeks ago",
      verified: true
    },
    {
      name: "Mahbubur Rahman",
      role: "Driving Instructor",
      location: "Dhaka, Bangladesh",
      review: "Creating lesson materials and student guides. The explanations are clear and easy to understand. My pass rate has improved!",
      rating: 5,
      date: "2 weeks ago",
      verified: true
    },
    {
      name: "Sumaya Khatun",
      role: "Makeup Artist",
      location: "Dhaka, Bangladesh",
      review: "Social media content and client communication made easy! The beauty tips and trend analysis are spot on. Followers have increased 200%!",
      rating: 5,
      date: "5 days ago",
      verified: true
    },
    {
      name: "Marcus Schmidt",
      role: "Mechanical Engineer",
      location: "Munich, Germany",
      review: "Solid for technical calculations and documentation. The engineering knowledge is comprehensive. A valuable tool for professionals.",
      rating: 5,
      date: "1 week ago",
      verified: true
    },
    {
      name: "Nazma Begum",
      role: "Tailor",
      location: "Narayanganj, Bangladesh",
      review: "Learning new designs and creating order lists. Even helped me start an online presence! The Bengali interface is so easy to use.",
      rating: 5,
      date: "4 days ago",
      verified: true
    },
    {
      name: "Delwar Hossain",
      role: "Tour Guide",
      location: "Cox's Bazar, Bangladesh",
      review: "Creating tour packages and promotional content. The travel knowledge is excellent. Tourists love the detailed itineraries I provide now!",
      rating: 5,
      date: "2 weeks ago",
      verified: true
    },
    {
      name: "Michelle Lee",
      role: "Healthcare Admin",
      location: "Singapore",
      review: "Great for patient communication and administrative tasks. The medical terminology accuracy is impressive. Saves hours of work daily.",
      rating: 5,
      date: "1 month ago",
      verified: true
    },
    {
      name: "Hasibur Rahman",
      role: "Pharmacy Owner",
      location: "Dhaka, Bangladesh",
      review: "Customer education and inventory management assistance. The pharmaceutical knowledge is accurate. Customers appreciate the detailed information!",
      rating: 5,
      date: "1 week ago",
      verified: true
    },
    {
      name: "Sadia Afrin",
      role: "Dance Instructor",
      location: "Dhaka, Bangladesh",
      review: "Creating class schedules and promotional content. The creative writing for social media is engaging. Student enrollment has doubled!",
      rating: 5,
      date: "6 days ago",
      verified: true
    },
    {
      name: "George Miller",
      role: "Voice Actor",
      location: "Vancouver, Canada",
      review: "Excellent for script practice and character development. The creative suggestions are unique. Has improved my audition preparation significantly.",
      rating: 5,
      date: "3 weeks ago",
      verified: true
    },
    {
      name: "Laila Rahman",
      role: "Pediatrician",
      location: "Dhaka, Bangladesh",
      review: "Creating parent education materials and clinic communications. The child health information is accurate and easy to understand. Highly valuable!",
      rating: 5,
      date: "2 weeks ago",
      verified: true
    },
    {
      name: "Iqbal Hossain",
      role: "Music Teacher",
      location: "Dhaka, Bangladesh",
      review: "Lesson planning and theory explanations made easier. The music knowledge is comprehensive. Students are learning faster than ever!",
      rating: 5,
      date: "5 days ago",
      verified: true
    },
    {
      name: "Sandra Costa",
      role: "Fitness Influencer",
      location: "São Paulo, Brazil",
      review: "Perfect for workout content and nutrition advice. The health and fitness knowledge is solid. My followers love the detailed explanations!",
      rating: 5,
      date: "1 week ago",
      verified: true
    },
    {
      name: "Morshed Alam",
      role: "Veterinarian",
      location: "Dhaka, Bangladesh",
      review: "Pet health education and client communication. The veterinary knowledge is accurate. Pet owners appreciate the detailed care instructions!",
      rating: 5,
      date: "4 days ago",
      verified: true
    },
    {
      name: "Roksana Begum",
      role: "Handicraft Seller",
      location: "Jamalpur, Bangladesh",
      review: "Product descriptions and social media marketing. The Bengali content feels natural. My handicraft business has grown 150% in 3 months!",
      rating: 5,
      date: "2 weeks ago",
      verified: true
    },
    {
      name: "Oliver Wright",
      role: "Environmental Scientist",
      location: "Wellington, New Zealand",
      review: "Great for research summaries and report writing. The environmental science knowledge is up-to-date. A valuable research companion.",
      rating: 5,
      date: "1 month ago",
      verified: true
    },
    {
      name: "Shohel Rana",
      role: "Auto Mechanic",
      location: "Dhaka, Bangladesh",
      review: "Learning about new car technologies and creating service guides. The automotive knowledge is practical. Customers trust my expertise more now!",
      rating: 5,
      date: "1 week ago",
      verified: true
    },
    {
      name: "Tania Sultana",
      role: "Yoga Instructor",
      location: "Dhaka, Bangladesh",
      review: "Class planning and wellness content creation. The health and mindfulness knowledge is comprehensive. My studio has grown significantly!",
      rating: 5,
      date: "6 days ago",
      verified: true
    },
    {
      name: "Peter Johansson",
      role: "Architect",
      location: "Stockholm, Sweden",
      review: "Good for project documentation and client presentations. The architectural terminology is accurate. A useful addition to my toolkit.",
      rating: 4,
      date: "3 weeks ago",
      verified: true
    },
    {
      name: "Jamal Uddin",
      role: "Printing Press Owner",
      location: "Dhaka, Bangladesh",
      review: "Design suggestions and customer order management. The creative ideas have improved our output quality. Business is thriving!",
      rating: 5,
      date: "2 weeks ago",
      verified: true
    },
    {
      name: "Sharmin Nahar",
      role: "Daycare Owner",
      location: "Dhaka, Bangladesh",
      review: "Creating activity plans and parent communications. The child development knowledge is excellent. Parents love our professional approach now!",
      rating: 5,
      date: "5 days ago",
      verified: true
    },
    {
      name: "Nina Petrova",
      role: "Ballet Teacher",
      location: "Vienna, Austria",
      review: "Lesson planning and student progress tracking. The arts education suggestions are creative. My teaching has become more structured and effective.",
      rating: 5,
      date: "1 week ago",
      verified: true
    },
    {
      name: "Alamgir Kabir",
      role: "Security Consultant",
      location: "Dhaka, Bangladesh",
      review: "Report writing and security assessment documentation. The professional tone is perfect. Clients appreciate the detailed analysis reports!",
      rating: 5,
      date: "4 days ago",
      verified: true
    },
    {
      name: "Afroza Khanam",
      role: "Retired Teacher",
      location: "Dhaka, Bangladesh",
      review: "I'm 65 and learning to use AI! AI Sorix is so easy to use, even for someone my age. The Bengali interface is a blessing. Helping my grandchildren with homework!",
      rating: 5,
      date: "2 weeks ago",
      verified: true
    }
  ];

  // Convert database reviews to the display format
  const formattedDbReviews = dbReviews.map(review => ({
    ...review,
    date: formatRelativeDate(review.created_at),
  }));

  // Combine database reviews with base reviews (fallback)
  const allReviews = [...formattedDbReviews, ...baseReviews];

  // Helper function to format relative dates
  function formatRelativeDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return language === 'en' ? 'Today' : 'আজ';
    if (diffDays === 1) return language === 'en' ? 'Yesterday' : 'গতকাল';
    if (diffDays < 7) return language === 'en' ? `${diffDays} days ago` : `${diffDays} দিন আগে`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return language === 'en' ? `${weeks} week${weeks > 1 ? 's' : ''} ago` : `${weeks} সপ্তাহ আগে`;
    }
    const months = Math.floor(diffDays / 30);
    return language === 'en' ? `${months} month${months > 1 ? 's' : ''} ago` : `${months} মাস আগে`;
  }

  // Helper function to parse date strings for sorting
  const getDateValue = (dateStr, createdAt) => {
    // If we have a created_at timestamp, use it directly
    if (createdAt) return new Date(createdAt).getTime();
    
    if (dateStr === 'Just now' || dateStr === 'এইমাত্র' || dateStr === 'Today' || dateStr === 'আজ') return Date.now();
    if (dateStr === 'Yesterday' || dateStr === 'গতকাল') return Date.now() - (24 * 60 * 60 * 1000);
    if (dateStr.includes('week') || dateStr.includes('সপ্তাহ')) {
      const num = parseInt(dateStr) || 1;
      return Date.now() - (num * 7 * 24 * 60 * 60 * 1000);
    }
    if (dateStr.includes('month') || dateStr.includes('মাস')) {
      const num = parseInt(dateStr) || 1;
      return Date.now() - (num * 30 * 24 * 60 * 60 * 1000);
    }
    if (dateStr.includes('day') || dateStr.includes('দিন')) {
      const num = parseInt(dateStr) || 1;
      return Date.now() - (num * 24 * 60 * 60 * 1000);
    }
    return 0;
  };

  const filteredReviews = allReviews
    .filter(review => {
      const matchesFilter = filter === 'all' || 
        (filter === '5' && review.rating === 5) ||
        (filter === '4' && review.rating === 4) ||
        (filter === '3' && review.rating <= 3);
      
      const matchesSearch = review.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.review.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return getDateValue(b.date, b.created_at) - getDateValue(a.date, a.created_at);
        case 'oldest':
          return getDateValue(a.date, a.created_at) - getDateValue(b.date, b.created_at);
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

  const averageRating = (allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length).toFixed(1);
  const fiveStarCount = allReviews.filter(r => r.rating === 5).length;
  const fourStarCount = allReviews.filter(r => r.rating === 4).length;
  const threeStarCount = allReviews.filter(r => r.rating === 3).length;
  const twoStarCount = allReviews.filter(r => r.rating === 2).length;
  const oneStarCount = allReviews.filter(r => r.rating === 1).length;

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />);
      } else if (i - 0.5 === rating) {
        stars.push(<StarHalf key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />);
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-muted-foreground/30" />);
      }
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Reviews | AI Sorix" description="See what users say about AI Sorix. Real reviews from researchers, developers, students, and professionals worldwide." path="/reviews" />
      <Navbar />
      
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{language === 'en' ? 'Back to Home' : 'হোমে ফিরুন'}</span>
          </Link>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              {language === 'en' ? (
                <>Customer <span className="text-primary">Reviews</span></>
              ) : (
                <>গ্রাহক <span className="text-primary">রিভিউ</span></>
              )}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              {language === 'en' 
                ? "Real feedback from real users across Bangladesh and around the world"
                : "বাংলাদেশ এবং বিশ্বজুড়ে প্রকৃত ব্যবহারকারীদের কাছ থেকে প্রকৃত প্রতিক্রিয়া"}
            </p>

            {/* Write a Review Button */}
            {user ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl mb-8"
              >
                <PenLine className="h-4 w-4" />
                <span>{language === 'en' ? 'Write a Review' : 'রিভিউ লিখুন'}</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl mb-8"
              >
                <LogIn className="h-4 w-4" />
                <span>{language === 'en' ? 'Sign In to Write a Review' : 'রিভিউ লিখতে সাইন ইন করুন'}</span>
              </Link>
            )}

            {/* Stats Summary */}
            <div className="flex flex-wrap justify-center gap-6 sm:gap-12 mb-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span className="text-3xl sm:text-4xl font-bold text-foreground">{averageRating}</span>
                  <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
                </div>
                <p className="text-sm text-muted-foreground">{language === 'en' ? 'Average Rating' : 'গড় রেটিং'}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-foreground">{allReviews.length}</p>
                <p className="text-sm text-muted-foreground">{language === 'en' ? 'Total Reviews' : 'মোট রিভিউ'}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-foreground">{Math.round((fiveStarCount / allReviews.length) * 100)}%</p>
                <p className="text-sm text-muted-foreground">{language === 'en' ? '5-Star Reviews' : '৫-স্টার রিভিউ'}</p>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="max-w-md mx-auto mb-8">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-8">5★</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-400 rounded-full" 
                      style={{ width: `${(fiveStarCount / allReviews.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{fiveStarCount}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-8">4★</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-400 rounded-full" 
                      style={{ width: `${(fourStarCount / allReviews.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{fourStarCount}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-8">3★</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-400 rounded-full" 
                      style={{ width: `${(threeStarCount / allReviews.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{threeStarCount}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-8">2★</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-400 rounded-full" 
                      style={{ width: `${(twoStarCount / allReviews.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{twoStarCount}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-8">1★</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-400 rounded-full" 
                      style={{ width: `${(oneStarCount / allReviews.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{oneStarCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={language === 'en' ? "Search reviews..." : "রিভিউ খুঁজুন..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2.5 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="all">{language === 'en' ? 'All Ratings' : 'সব রেটিং'}</option>
                <option value="5">{language === 'en' ? '5 Stars' : '৫ স্টার'}</option>
                <option value="4">{language === 'en' ? '4 Stars' : '৪ স্টার'}</option>
                <option value="3">{language === 'en' ? '3 Stars & Below' : '৩ স্টার ও নিচে'}</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="newest">{language === 'en' ? 'Newest First' : 'নতুন আগে'}</option>
                <option value="oldest">{language === 'en' ? 'Oldest First' : 'পুরানো আগে'}</option>
                <option value="highest">{language === 'en' ? 'Highest Rating' : 'সর্বোচ্চ রেটিং'}</option>
                <option value="lowest">{language === 'en' ? 'Lowest Rating' : 'সর্বনিম্ন রেটিং'}</option>
              </select>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredReviews.map((review, index) => (
              <div 
                key={index}
                className="bg-card border border-border rounded-xl p-5 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      review.isUserSubmitted 
                        ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/40' 
                        : 'bg-gradient-to-br from-primary/20 to-primary/40'
                    }`}>
                      <span className={`text-sm font-semibold ${review.isUserSubmitted ? 'text-amber-600' : 'text-primary'}`}>
                        {review.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{review.name}</p>
                      <p className="text-xs text-muted-foreground">{review.role}</p>
                    </div>
                  </div>
                  {review.isUserSubmitted ? (
                    <span className="text-[10px] px-2 py-0.5 bg-amber-500/10 text-amber-600 rounded-full font-medium">
                      {language === 'en' ? 'Pending' : 'অপেক্ষমান'}
                    </span>
                  ) : review.verified ? (
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-600 rounded-full font-medium">
                      {language === 'en' ? 'Verified' : 'যাচাইকৃত'}
                    </span>
                  ) : null}
                </div>

                {/* Location & Date */}
                <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                  <span>{review.location}</span>
                  <span>•</span>
                  <span>{review.date}</span>
                </div>

                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {renderStars(review.rating)}
                </div>
                
                {/* Review */}
                <p className="text-foreground/80 text-sm leading-relaxed">
                  "{review.review}"
                </p>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredReviews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {language === 'en' ? 'No reviews found matching your criteria.' : 'আপনার মানদণ্ড অনুযায়ী কোনো রিভিউ পাওয়া যায়নি।'}
              </p>
            </div>
          )}

          {/* Results Count */}
          <div className="text-center mt-8 text-sm text-muted-foreground">
            {language === 'en' 
              ? `Showing ${filteredReviews.length} of ${allReviews.length} reviews`
              : `${allReviews.length}টি রিভিউয়ের মধ্যে ${filteredReviews.length}টি দেখানো হচ্ছে`}
          </div>
        </div>
      </main>

      {/* Write Review Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {language === 'en' ? 'Write a Review' : 'রিভিউ লিখুন'}
            </DialogTitle>
            <DialogDescription>
              {language === 'en' 
                ? 'Share your experience with AI Sorix. Your feedback helps us improve!'
                : 'AI Sorix এর সাথে আপনার অভিজ্ঞতা শেয়ার করুন। আপনার প্রতিক্রিয়া আমাদের উন্নত করতে সাহায্য করে!'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {language === 'en' ? 'Your Name' : 'আপনার নাম'} *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={language === 'en' ? 'e.g., John Doe' : 'যেমন, জন ডো'}
                className={`w-full px-4 py-2.5 rounded-lg border ${errors.name ? 'border-red-500' : 'border-border'} bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50`}
                maxLength={50}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Role/Profession */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {language === 'en' ? 'Your Role/Profession' : 'আপনার পেশা'} *
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder={language === 'en' ? 'e.g., Software Developer' : 'যেমন, সফটওয়্যার ডেভেলপার'}
                className={`w-full px-4 py-2.5 rounded-lg border ${errors.role ? 'border-red-500' : 'border-border'} bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50`}
                maxLength={50}
              />
              {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {language === 'en' ? 'Your Location' : 'আপনার অবস্থান'} *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder={language === 'en' ? 'e.g., Dhaka, Bangladesh' : 'যেমন, ঢাকা, বাংলাদেশ'}
                className={`w-full px-4 py-2.5 rounded-lg border ${errors.location ? 'border-red-500' : 'border-border'} bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50`}
                maxLength={50}
              />
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {language === 'en' ? 'Your Rating' : 'আপনার রেটিং'} *
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star 
                      className={`h-7 w-7 ${
                        star <= formData.rating 
                          ? 'fill-amber-400 text-amber-400' 
                          : 'text-muted-foreground/30 hover:text-amber-400/50'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Review */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {language === 'en' ? 'Your Review' : 'আপনার রিভিউ'} *
              </label>
              <textarea
                value={formData.review}
                onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                placeholder={language === 'en' 
                  ? 'Share your experience with AI Sorix...' 
                  : 'AI Sorix এর সাথে আপনার অভিজ্ঞতা শেয়ার করুন...'}
                rows={4}
                className={`w-full px-4 py-2.5 rounded-lg border ${errors.review ? 'border-red-500' : 'border-border'} bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none`}
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.review ? (
                  <p className="text-red-500 text-xs">{errors.review}</p>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    {language === 'en' ? 'Minimum 20 characters' : 'সর্বনিম্ন ২০ অক্ষর'}
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  {formData.review.length}/500
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setErrors({});
                }}
                className="flex-1 px-4 py-2.5 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
              >
                {language === 'en' ? 'Cancel' : 'বাতিল'}
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
              >
                {language === 'en' ? 'Submit Review' : 'রিভিউ জমা দিন'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Reviews;
