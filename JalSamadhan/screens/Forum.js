import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Context from "../ContextAPI";
import { COLORS, SIZES, FONTS, SHADOWS } from "../constants/Theme";

function ForumScreen() {
  const context = useContext(Context);
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userVotes, setUserVotes] = useState({}); // Track user votes

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    const data = await context.getPosts();
    setPosts(data);
    setIsLoading(false);
  };

  const handlePost = async () => {
    if (!newPostTitle.trim()) return;
    setIsPosting(true);
    await context.createPost(newPostTitle, context.name || "Community Member");
    setNewPostTitle("");
    await fetchPosts();
    setIsPosting(false);
  };

  const handleUpvote = async (postId, currentUpvotes) => {
    // Check if user has already upvoted this post twice
    const userUpvotes = userVotes[postId] || { upvotes: 0, downvotes: 0 };
    
    if (userUpvotes.upvotes >= 2) {
      Alert.alert("Limit Reached", "You can only upvote a post 2 times!");
      return;
    }

    // Optimistic UI update
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId ? { ...post, upvotes: post.upvotes + 1 } : post
      )
    );

    // Update user votes
    setUserVotes(prev => ({
      ...prev,
      [postId]: { ...userUpvotes, upvotes: userUpvotes.upvotes + 1 }
    }));

    await context.upvotePost(postId, currentUpvotes);
  };

  const handleDownvote = async (postId, currentDownvotes) => {
    // Check if user has already downvoted this post twice
    const userDownvotes = userVotes[postId] || { upvotes: 0, downvotes: 0 };
    
    if (userDownvotes.downvotes >= 2) {
      Alert.alert("Limit Reached", "You can only downvote a post 2 times!");
      return;
    }

    // Optimistic UI update
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId ? { ...post, downvotes: (post.downvotes || 0) + 1 } : post
      )
    );

    // Update user votes
    setUserVotes(prev => ({
      ...prev,
      [postId]: { ...userDownvotes, downvotes: userDownvotes.downvotes + 1 }
    }));

    // You'll need to add this function to your ContextAPI
    // await context.downvotePost(postId, currentDownvotes);
  };

  const renderPostItem = ({ item }) => {
    // Basic relative time calculation
    const postDate = new Date(item.timestamp);
    const formattedDate = postDate.toLocaleDateString() + " " + postDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const userVoteCount = userVotes[item.id] || { upvotes: 0, downvotes: 0 };

    return (
      <View style={styles.postCard}>
        <View style={styles.postHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.name ? item.name.charAt(0).toUpperCase() : "A"}</Text>
          </View>
          <View style={styles.postMeta}>
            <Text style={styles.authorName}>{item.name}</Text>
            <Text style={styles.timestamp}>{formattedDate}</Text>
          </View>
        </View>

        <Text style={styles.postTitle}>{item.title}</Text>

        <View style={styles.postActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleUpvote(item.id, item.upvotes)}
          >
            <Ionicons name="arrow-up-circle-outline" size={24} color={COLORS.primary} />
            <Text style={styles.actionText}>{item.upvotes || 0}</Text>
            <Text style={styles.voteCountText}>({userVoteCount.upvotes}/2)</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDownvote(item.id, item.downvotes)}
          >
            <Ionicons name="arrow-down-circle-outline" size={24} color={COLORS.error} />
            <Text style={[styles.actionText, styles.downvoteText]}>{item.downvotes || 0}</Text>
            <Text style={styles.voteCountText}>({userVoteCount.downvotes}/2)</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Community Forum</Text>
          <Text style={styles.subtitle}>Share and discuss with the community</Text>
        </View>

        <View style={styles.createPostContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Start a discussion..."
            value={newPostTitle}
            onChangeText={setNewPostTitle}
            multiline
          />
          <TouchableOpacity
            style={[styles.postButton, !newPostTitle.trim() && styles.postButtonDisabled]}
            onPress={handlePost}
            disabled={!newPostTitle.trim() || isPosting}
          >
            {isPosting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Ionicons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.postsContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          ) : (
            <FlatList
              data={posts}
              renderItem={renderPostItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  createPostContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    alignItems: 'flex-end',
    gap: 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    padding: 12,
    fontSize: 16,
    maxHeight: 80,
    backgroundColor: COLORS.surface,
  },
  postButton: {
    backgroundColor: COLORS.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postButtonDisabled: {
    backgroundColor: COLORS.textSecondary,
  },
  postsContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postCard: {
    backgroundColor: COLORS.surface,
    padding: 16,
    marginBottom: 12,
    borderRadius: SIZES.radius,
    ...SHADOWS.small,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: COLORS.surface,
    fontSize: 18,
    fontWeight: 'bold',
  },
  postMeta: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  postTitle: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: SIZES.radius,
    backgroundColor: 'transparent',
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  downvoteText: {
    color: COLORS.error,
  },
  voteCountText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
});

export default ForumScreen;
