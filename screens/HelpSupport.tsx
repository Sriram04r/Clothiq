import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Linking, LayoutAnimation, Platform, UIManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, MessageCircle, Phone, Mail, ChevronDown, ChevronUp } from 'lucide-react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQS = [
  {
    question: "How long does dry cleaning take?",
    answer: "Standard dry cleaning takes 48 hours from the time of pickup. For express service, we can deliver within 24 hours for an additional fee."
  },
  {
    question: "How do I track my order?",
    answer: "You can track your order in real-time by going to the 'Orders' tab and selecting your active order. You will see live updates from pickup to delivery."
  },
  {
    question: "What if my clothes get damaged?",
    answer: "We treat your garments with the utmost care. In the rare event of damage, Clothiq's premium insurance policy will cover the cost of the item."
  },
  {
    question: "Do you offer eco-friendly washing?",
    answer: "Yes! We use 100% eco-friendly and organic solvents for all our premium wash and fold services."
  }
];

export default function HelpSupportScreen({ navigation }: any) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const openLink = (url: string) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Contact Methods Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.sectionSub}>Our premium support team is available 24/7 to assist you.</Text>
          
          <View style={styles.contactGrid}>
            <TouchableOpacity style={styles.contactCard} onPress={() => openLink('tel:+919666394628')} activeOpacity={0.7}>
              <View style={[styles.iconBox, { backgroundColor: '#E0E7FF' }]}>
                <Phone size={24} color="#1C158A" />
              </View>
              <Text style={styles.contactTitle}>Call Us</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactCard} onPress={() => openLink('mailto:admin2@clothiq.com')} activeOpacity={0.7}>
              <View style={[styles.iconBox, { backgroundColor: '#FFEDD5' }]}>
                <Mail size={24} color="#EA580C" />
              </View>
              <Text style={styles.contactTitle}>Email</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactCard} onPress={() => openLink('https://wa.me/919666394628')} activeOpacity={0.7}>
              <View style={[styles.iconBox, { backgroundColor: '#DCFCE7' }]}>
                <MessageCircle size={24} color="#16A34A" />
              </View>
              <Text style={styles.contactTitle}>Chat</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          
          <View style={styles.faqList}>
            {FAQS.map((faq, index) => {
              const isExpanded = expandedIndex === index;
              return (
                <View key={index} style={[styles.faqItem, isExpanded && styles.faqItemExpanded]}>
                  <TouchableOpacity 
                    style={styles.faqQuestion} 
                    onPress={() => toggleExpand(index)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.questionText}>{faq.question}</Text>
                    {isExpanded ? (
                      <ChevronUp size={20} color="#2945FF" />
                    ) : (
                      <ChevronDown size={20} color="#94A3B8" />
                    )}
                  </TouchableOpacity>
                  
                  {isExpanded && (
                    <View style={styles.faqAnswerBox}>
                      <Text style={styles.answerText}>{faq.answer}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FAFAFA',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
  },
  sectionSub: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 24,
    lineHeight: 20,
  },
  contactGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  contactCard: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  faqList: {
    gap: 12,
  },
  faqItem: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  faqItemExpanded: {
    borderColor: '#2945FF',
    backgroundColor: '#F8FAFF',
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  questionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginRight: 16,
  },
  faqAnswerBox: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
    marginTop: 4,
  },
  answerText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
});
