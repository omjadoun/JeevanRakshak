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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Context from "../ContextAPI";

function ForumScreen() {
  const context = useContext(Context);
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    // Optimistic UI update
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId ? { ...post, upvotes: post.upvotes + 1 } : post
      )
    );
    await context.upvotePost(postId, currentUpvotes);
  };

  const renderPostItem = ({ item }) => {
    // Basic relative time calculation
    const postDate = new Date(item.timestamp);
    const formattedDate = postDate.toLocaleDateString() + " " + postDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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
            <Ionicons name="arrow-up-circle-outline" size={24} color="#3498db" />
            <Text style={styles.actionText}>{item.upvotes}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
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
            <Text style={styles.postButtonText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Loading latest posts...</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderPostItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No discussions yet. Be the first!</Text>
          }
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },
  createPostContainer: {
    padding: 16,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    zIndex: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 10,
  },
  postButton: {
    backgroundColor: "#3498db",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  postButtonDisabled: {
    backgroundColor: "#a5b1c2",
  },
  postButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  divider: {
    height: 8,
    backgroundColor: "#F4F6F8",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  postCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
  },
  postMeta: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  timestamp: {
    fontSize: 12,
    color: "#7f8c8d",
    marginTop: 2,
  },
  postTitle: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginBottom: 16,
  },
  postActions: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 15,
    color: "#555",
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#7f8c8d",
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    color: "#7f8c8d",
    marginTop: 40,
    fontSize: 16,
    fontStyle: "italic",
  },
});

export default ForumScreen;
