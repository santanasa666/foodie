import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
// 1. IMPORT useIsFocused
import { useNavigation, useIsFocused } from "@react-navigation/native"; 
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function MyRecipeScreen() {
  const navigation = useNavigation();
  // 2. DECLARE isFocused
  const isFocused = useIsFocused(); 
  const [recipes, setrecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // 3. IMPLEMENT the fetching logic
  const fetchrecipes = async () => {
    try {
      setLoading(true);
      const storedRecipes = await AsyncStorage.getItem("customrecipes");
      if (storedRecipes) {
        setrecipes(JSON.parse(storedRecipes));
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  // 4. TRIGGER fetch when screen is focused
  useEffect(() => {
    if (isFocused) {
      fetchrecipes();
    }
  }, [isFocused]);

  const handleAddrecipe = () => {
    navigation.navigate("RecipesFormScreen");
  };

  const handlerecipeClick = (recipe) => {
    navigation.navigate("CustomRecipesScreen", { recipe });
  };

  const deleterecipe = async (index) => {
    try {
      const updatedRecipes = [...recipes];
      updatedRecipes.splice(index, 1);
      setrecipes(updatedRecipes);
      await AsyncStorage.setItem("customrecipes", JSON.stringify(updatedRecipes));
    } catch (error) {
      console.log("Error deleting recipe:", error);
    }
  };

  const editrecipe = (recipe, index) => {
    navigation.navigate("RecipesFormScreen", {
      recipeToEdit: recipe,
      recipeIndex: index,
      onrecipeEdited: fetchrecipes,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
        <Pressable onPress={handleAddrecipe} style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add Recipe</Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F75FF" />
        </View>
      ) : (
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {recipes.length === 0 ? (
            <Text style={styles.norecipesText}>No recipes added yet.</Text>
          ) : (
            recipes.map((recipe, index) => (
              <View key={index} style={styles.recipeCard} testID="recipeCard">
                <Pressable onPress={() => handlerecipeClick(recipe)}>
                  <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
                  <Text style={styles.recipeTitle}>{recipe.title}</Text>
                  <Text style={styles.recipeDescription} numberOfLines={2} testID="recipeDescp">
                    {recipe.description?.length > 50
                    ? `${recipe.description.substring(0,50)}...`
                  : recipe.description}
                  </Text>
                </Pressable>
                <View style={styles.actionButtonsContainer}>
                  <Pressable style={styles.editButton} onPress={() => editrecipe(recipe, index)}>
                    <Text style={styles.editButtonText}>Edit</Text>
                  </Pressable>
                  <Pressable style={styles.deleteButton} onPress={() => deleterecipe(index)}>
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
    paddingTop: hp(2), // Give some breathing room from the top
    backgroundColor: "#F9FAFB",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(2),
  },
  backButton: {
    paddingVertical: hp(1),
    paddingRight: wp(4),
  },
  backButtonText: {
    fontSize: hp(2),
    color: "#6B7280",
    fontWeight: "500",
  },
  addButton: {
    backgroundColor: "#4F75FF",
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(4),
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: hp(1.8),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    paddingBottom: hp(4),
    // Removed the flexWrap row layout to favor a clean single-column mobile list
  },
  norecipesText: {
    textAlign: "center",
    fontSize: hp(2),
    color: "#9CA3AF",
    marginTop: hp(10),
  },
  recipeCard: {
    width: "100%", // Dynamically fits screen instead of hardcoded 400
    backgroundColor: "#fff",
    padding: wp(4),
    borderRadius: 12,
    marginBottom: hp(2),
    // React Native proper shadow properties
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android
  },
  recipeImage: {
    width: "100%",
    height: hp(20), // Responsive height
    borderRadius: 8,
    marginBottom: hp(1.5),
  },
  recipeTitle: {
    fontSize: hp(2.2),
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: hp(0.5),
  },
  recipeDescription: {
    fontSize: hp(1.8),
    color: "#6B7280",
    marginBottom: hp(2),
    lineHeight: hp(2.5),
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto", // Pushes buttons to the bottom of the card if content varies
  },
  editButton: {
    backgroundColor: "#10B981", // Slightly tweaked green for better contrast
    paddingVertical: hp(1.2),
    borderRadius: 8,
    width: "48%", // Flex-friendly width
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: hp(1.8),
  },
  deleteButton: {
    backgroundColor: "#EF4444",
    paddingVertical: hp(1.2),
    borderRadius: 8,
    width: "48%", // Flex-friendly width
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: hp(1.8),
  },
});
