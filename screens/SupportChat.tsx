import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, TextInput,
  FlatList, KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Send, Bot } from 'lucide-react-native';
import { sendMessageToGroq } from '../utils/groqApi';
import { getFirestore, collection, query, getDocs } from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function SupportChatScreen({ navigation }: any) {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      text: 'Hi there! 👋 I am the Clothiq Support AI. How can I help you with your laundry today?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [userContext, setUserContext] = useState("");

  useEffect(() => {
    const fetchContext = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;

        const db = getFirestore();
        const q = query(collection(db, 'users', user.uid, 'orders'));
        const snapshot = await getDocs(q);
        const activeOrders = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter((o: any) => o.status !== 'delivered' && o.status !== 'cancelled');

        if (activeOrders.length === 0) {
          setUserContext("The user currently has no pending orders or tasks.");
        } else {
          setUserContext(`The user has ${activeOrders.length} active order(s). Details: ` + JSON.stringify(activeOrders));
        }
      } catch (err) {
        console.log("Error fetching user context for AI", err);
      }
    };
    fetchContext();
  }, []);

  const flatListRef = useRef<FlatList>(null);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Call Groq API
    const botResponseText = await sendMessageToGroq(userMsg.text, messages.slice(1), userContext);

    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      text: botResponseText,
      isUser: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.isUser;

    return (
      <View style={[styles.messageWrapper, isUser ? styles.messageWrapperUser : styles.messageWrapperBot]}>
        {!isUser && (
          <View style={styles.botAvatar}>
            <Bot size={16} color="#FFF" />
          </View>
        )}
        <View style={[styles.messageBubble, isUser ? styles.messageBubbleUser : styles.messageBubbleBot]}>
          <Text style={[styles.messageText, isUser ? styles.messageTextUser : styles.messageTextBot]}>
            {item.text}
          </Text>
          <Text style={[styles.timeText, isUser ? styles.timeTextUser : styles.timeTextBot]}>
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#111" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Clothiq Support</Text>
          <Text style={styles.headerSubtitle}></Text>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 25}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatContainer}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {isTyping && (
          <View style={styles.typingContainer}>
            <View style={styles.botAvatarSmall}>
              <Bot size={12} color="#FFF" />
            </View>
            <Text style={styles.typingText}>Clothiq AI is typing...</Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type your question..."
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim() || isTyping}
          >
            {isTyping ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Send size={20} color="#FFF" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    zIndex: 10,
  },
  headerTitleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 2,
  },
  keyboardView: {
    flex: 1,
  },
  chatContainer: {
    padding: 16,
    gap: 16,
  },
  messageWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: '85%',
  },
  messageWrapperUser: {
    alignSelf: 'flex-end',
  },
  messageWrapperBot: {
    alignSelf: 'flex-start',
  },
  botAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2945FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  messageBubbleUser: {
    backgroundColor: '#2945FF',
    borderBottomRightRadius: 4,
  },
  messageBubbleBot: {
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  messageTextUser: {
    color: '#FFF',
  },
  messageTextBot: {
    color: '#111',
  },
  timeText: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  timeTextUser: {
    color: 'rgba(255,255,255,0.7)',
  },
  timeTextBot: {
    color: '#9CA3AF',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  botAvatarSmall: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#9CA3AF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  typingText: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 15,
    color: '#111',
    marginRight: 12,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2945FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#D1D5DB',
  }
});
