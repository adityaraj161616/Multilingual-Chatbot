/**
 * Seed script for SCHOLARSHIPS ONLY
 * Run this script to add scholarship data separately
 */

import { connectToDatabase } from "../lib/mongodb"
import { Scholarship } from "../lib/models/campus.model"

async function seedScholarships() {
  try {
    await connectToDatabase()

    console.log("Starting scholarship data seeding...")

    // Clear existing scholarships
    await Scholarship.deleteMany({})

    console.log("Seeding scholarships...")
    const scholarships = [
      {
        name: {
          en: "Post-Matric Scholarship",
          hi: "पोस्ट-मैट्रिक छात्रवृत्ति",
          ta: "பிந்தைய மெட்ரிக் உதவித்தொகை",
          te: "పోస్ట్-మెట్రిక్ స్కాలర్‌షిప్",
          bn: "পোস্ট-ম্যাট্রিক বৃত্তি",
          mr: "पोस्ट-मॅट्रिक शिष्यवृत्ती",
        },
        description: {
          en: "Government scholarship for SC/ST/OBC students",
          hi: "एससी/एसटी/ओबीसी छात्रों के लिए सरकारी छात्रवृत्ति",
          ta: "எஸ்சி/எஸ்டி/ஓபிசி மாணவர்களுக்கு அரசு உதவித்தொகை",
          te: "SC/ST/OBC విద్యార్థులకు ప్రభుత్వ స్కాలర్‌షిప్",
          bn: "SC/ST/OBC শিক্ষার্থীদের জন্য সরকারি বৃত্তি",
          mr: "SC/ST/OBC विद्यार्थ्यांसाठी सरकारी शिष्यवृत्ती",
        },
        eligibility: {
          en: "SC/ST/OBC category, family income below Rs 2.5 lakhs annually",
          hi: "एससी/एसटी/ओबीसी श्रेणी, पारिवारिक आय वार्षिक रु 2.5 लाख से कम",
          ta: "எஸ்சி/எஸ்டி/ஓபிசி வகை, குடும்ப வருமானம் ஆண்டுக்கு ரூ 2.5 லட்சத்திற்கு குறைவு",
          te: "SC/ST/OBC వర్గం, కుటుంబ ఆదాయం సంవత్సరానికి రూ 2.5 లక్షల కంటే తక్కువ",
          bn: "SC/ST/OBC শ্রেণী, পারিবারিক আয় বার্ষিক ₹২.৫ লাখের নিচে",
          mr: "SC/ST/OBC श्रेणी, कौटुंबिक उत्पन्न वार्षिक ₹२.५ लाखांपेक्षा कमी",
        },
        amount: "Up to Rs 50,000 per year",
        applicationProcess: {
          en: "Apply online through National Scholarship Portal (NSP)",
          hi: "राष्ट्रीय छात्रवृत्ति पोर्टल (एनएसपी) के माध्यम से ऑनलाइन आवेदन करें",
          ta: "தேசிய உதவித்தொகை போர்டல் (NSP) மூலம் ஆன்லைனில் விண்ணப்பிக்கவும்",
          te: "నేషనల్ స్కాలర్‌షిప్ పోర్టల్ (NSP) ద్వారా ఆన్‌లైన్‌లో దరఖాస్తు చేయండి",
          bn: "ন্যাশনাল স্কলারশিপ পোর্টাল (NSP) এর মাধ্যমে অনলাইনে আবেদন করুন",
          mr: "राष्ट्रीय शिष्यवृत्ती पोर्टल (NSP) द्वारे ऑनलाइन अर्ज करा",
        },
        deadline: new Date("2025-08-25"),
        isActive: true,
      },
      {
        name: {
          en: "Merit-Cum-Means Scholarship",
          hi: "मेरिट-कम-मीन्स छात्रवृत्ति",
          ta: "தகுதி-கம்-வழிமுறைகள் உதவித்தொகை",
          te: "మెరిట్-కమ్-మీన్స్ స్కాలర్‌షిప్",
          bn: "মেধা-কাম-মাধ্যম বৃত্তি",
          mr: "मेरिट-कम-मीन्स शिष्यवृत्ती",
        },
        description: {
          en: "For minority community students with excellent academic records",
          hi: "उत्कृष्ट शैक्षणिक रिकॉर्ड वाले अल्पसंख्यक समुदाय के छात्रों के लिए",
          ta: "சிறந்த கல்வி சாதனைகளுடன் சிறுபான்மை சமூக மாணவர்களுக்கு",
          te: "అద్భుతమైన విద్యా రికార్డులతో మైనారిటీ కమ్యూనిటీ విద్యార్థులకు",
          bn: "উৎকৃষ্ট শিক্ষাগত রেকর্ড সহ সংখ্যালঘু সম্প্রদায়ের শিক্ষার্থীদের জন্য",
          mr: "उत्कृष्ट शैक्षणिक रेकॉर्ड असलेल्या अल्पसंख्याक समुदायाच्या विद्यार्थ्यांसाठी",
        },
        eligibility: {
          en: "75%+ marks in previous examination, family income below Rs 5 lakhs",
          hi: "पिछली परीक्षा में 75%+ अंक, पारिवारिक आय रु 5 लाख से कम",
          ta: "முந்தைய தேர்வில் 75%+ மதிப்பெண்கள், குடும்ப வருமானம் ரூ 5 லட்சத்திற்கு குறைவு",
          te: "గత పరీక్షలో 75%+ మార్కులు, కుటుంబ ఆదాయం రూ 5 లక్షల కంటే తక్కువ",
          bn: "পূর্ববর্তী পরীক্ষায় ৭৫%+ নম্বর, পারিবারিক আয় ₹৫ লাখের নিচে",
          mr: "मागील परीक्षेत ७५%+ गुण, कौटुंबिक उत्पन्न ₹५ लाखांपेक्षा कमी",
        },
        amount: "Up to 50% fee waiver",
        applicationProcess: {
          en: "Submit application with mark sheets and income certificate to college office",
          hi: "अंक पत्रक और आय प्रमाण पत्र के साथ आवेदन कॉलेज कार्यालय में जमा करें",
          ta: "மதிப்பெண் தாள்கள் மற்றும் வருமான சான்றிதழுடன் விண்ணப்பத்தை கல்லூரி அலுவலகத்தில் சமர்ப்பிக்கவும்",
          te: "మార్క్‌షీట్లు మరియు ఆదాయ సర్టిఫికేట్‌తో దరఖాస్తును కళాశాల కార్యాలయానికి సమర్పించండి",
          bn: "মার্কশিট এবং আয়ের শংসাপত্র সহ আবেদন কলেজ অফিসে জমা দিন",
          mr: "गुणपत्रके आणि उत्पन्न प्रमाणपत्रासह अर्ज महाविद्यालय कार्यालयात सादर करा",
        },
        isActive: true,
      },
      {
        name: {
          en: "Minority Scholarship",
          hi: "अल्पसंख्यक छात्रवृत्ति",
          ta: "சிறுபான்மை உதவித்தொகை",
          te: "మైనారిటీ స్కాలర్‌షిప్",
          bn: "সংখ্যালঘু বৃত্তি",
          mr: "अल्पसंख्याक शिष्यवृत्ती",
        },
        description: {
          en: "Financial assistance for students from minority communities",
          hi: "अल्पसंख्यक समुदायों के छात्रों के लिए वित्तीय सहायता",
          ta: "சிறுபான்மை சமூகங்களைச் சேர்ந்த மாணவர்களுக்கு நிதி உதவி",
          te: "మైనారిటీ కమ్యూనిటీల విద్యార్థులకు ఆర్థిక సహాయం",
          bn: "সংখ্যালঘু সম্প্রদায়ের শিক্ষার্থীদের জন্য আর্থিক সহায়তা",
          mr: "अल्पसंख्याक समुदायातील विद्यार्थ्यांसाठी आर्थिक सहाय्य",
        },
        eligibility: {
          en: "Muslim, Christian, Sikh, Buddhist, Jain, Parsi communities",
          hi: "मुस्लिम, ईसाई, सिख, बौद्ध, जैन, पारसी समुदाय",
          ta: "முஸ்லிம், கிறிஸ்தவர், சீக்கியர், புத்த, ஜெயின், பார்சி சமூகங்கள்",
          te: "ముస్లిం, క్రైస్తవ, సిక్కు, బౌద్ధ, జైన, పార్సీ కమ్యూనిటీలు",
          bn: "মুসলিম, খ্রিস্টান, শিখ, বৌদ্ধ, জৈন, পার্সি সম্প্রদায়",
          mr: "मुस्लिम, ख्रिश्चन, शीख, बौद्ध, जैन, पारशी समुदाय",
        },
        amount: "Rs 30,000 - Rs 40,000 per year",
        applicationProcess: {
          en: "Apply through Ministry of Minority Affairs portal",
          hi: "अल्पसंख्यक मामलों के मंत्रालय पोर्टल के माध्यम से आवेदन करें",
          ta: "சிறுபான்மை விவகார அமைச்சக போர்டல் மூலம் விண்ணப்பிக்கவும்",
          te: "మైనారిటీ అఫైర్స్ మంత్రిత్వ శాఖ పోర్టల్ ద్వారా దరఖాస్తు చేయండి",
          bn: "সংখ্যালঘু বিষয়ক মন্ত্রণালয় পোর্টালের মাধ্যমে আবেদন করুন",
          mr: "अल्पसंख्याक व्यवहार मंत्रालय पोर्टलद्वारे अर्ज करा",
        },
        isActive: true,
      },
      {
        name: {
          en: "SC/ST Scholarship",
          hi: "एससी/एसटी छात्रवृत्ति",
          ta: "எஸ்சி/எஸ்டி உதவித்தொகை",
          te: "SC/ST స్కాలర్‌షిప్",
          bn: "SC/ST বৃত্তি",
          mr: "SC/ST शिष्यवृत्ती",
        },
        description: {
          en: "Central government scholarship for SC/ST students",
          hi: "एससी/एसटी छात्रों के लिए केंद्र सरकार की छात्रवृत्ति",
          ta: "எஸ்சி/எஸ்டி மாணவர்களுக்கு மத்திய அரசு உதவித்தொகை",
          te: "SC/ST విద్యార్థులకు కేంద్ర ప్రభుత్వ స్కాలర్‌షిప్",
          bn: "SC/ST শিক্ষার্থীদের জন্য কেন্দ্রীয় সরকারি বৃত্তি",
          mr: "SC/ST विद्यार्थ्यांसाठी केंद्र सरकारी शिष्यवृत्ती",
        },
        eligibility: {
          en: "Belonging to SC/ST category with valid caste certificate",
          hi: "वैध जाति प्रमाण पत्र के साथ एससी/एसटी श्रेणी से संबंधित",
          ta: "செல்லுபடியாகும் சாதி சான்றிதழுடன் எஸ்சி/எஸ்டி வகையைச் சேர்ந்தவர்",
          te: "చెల్లుబాటు అయ్యే కుల ప్రమాణంతో SC/ST వర్గానికి చెందినవారు",
          bn: "বৈধ জাতি শংসাপত্র সহ SC/ST শ্রেণীর অন্তর্গত",
          mr: "वैध जात प्रमाणपत्रासह SC/ST श्रेणीतील",
        },
        amount: "Full tuition fee reimbursement + Rs 20,000 per year",
        applicationProcess: {
          en: "Register on National Scholarship Portal and submit documents",
          hi: "राष्ट्रीय छात्रवृत्ति पोर्टल पर पंजीकरण करें और दस्तावेज जमा करें",
          ta: "தேசிய உதவித்தொகை போர்டலில் பதிவு செய்து ஆவணங்களைச் சமர்ப்பிக்கவும்",
          te: "నేషనల్ స్కాలర్‌షిప్ పోర్టల్‌లో నమోదు చేసి పత్రాలను సమర్పించండి",
          bn: "জাতীয় বৃত্তি পোর্টালে নিবন্ধন করুন এবং নথি জমা দিন",
          mr: "राष्ट्रीय शिष्यवृत्ती पोर्टलवर नोंदणी करा आणि कागदपत्रे सादर करा",
        },
        isActive: true,
      },
    ]

    await Scholarship.insertMany(scholarships)

    console.log("✅ Scholarship seeding completed successfully!")
    console.log(`Inserted ${scholarships.length} scholarships`)
  } catch (error) {
    console.error("❌ Error seeding scholarships:", error)
    throw error
  }
}

seedScholarships()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
