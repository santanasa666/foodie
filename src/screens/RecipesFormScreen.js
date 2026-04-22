import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Pressable, } from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from "react-native-responsive-screen";


export default function RecipesFormScreen({ route, navigation }) {
  const { recipeToEdit, recipeIndex, onrecipeEdited } = route.params || {};
  const [title, setTitle] = useState(recipeToEdit ? recipeToEdit.title : "");
  const [image, setImage] = useState(recipeToEdit ? recipeToEdit.image : "");
  const [description, setDescription] = useState(
    recipeToEdit ? recipeToEdit.description : ""
  );

  const saverecipe = async () => {
    try {
      //initialize new recipe object from state
      const newRecipe = { title, image, description };

      const existingRecipes = await AsyncStorage.getItem("customrecipes");
      let recipes = existingRecipes ? JSON.parse(existingRecipes) : [];

      //update or add recipe
      if (recipeToEdit) {
        recipes[recipeIndex] = newRecipe;
      }
      if (onrecipeEdited) {
        onrecipeEdited();
      }else {
        recipes.push(newRecipe);
      }

      await AsyncStorage.setItem("customrecipes", JSON.stringify(recipes));

      navigation.goBack();

    }

    catch(error) {
      console.log("Failed to save recipe", error);
    }
  };

  return (
    <View style={styles.container}>
      
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Image URL"
        value={image}
        onChangeText={setImage}
        style={styles.input}
      />
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <Text style={styles.imagePlaceholder}>Upload Image URL</Text>
      )}
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline={true}
        numberOfLines={4}
        style={[styles.input, { height: hp(20), textAlignVertical: "top" }]}
      />
      <View style={styles.containerButtons}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Cancel</Text>
      </Pressable>
      <Pressable onPress={saverecipe} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save recipe</Text>
      </Pressable></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4),
  },
  containerButtons:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignContent:"center",
    padding: wp(2),

  },
  backButton: {
    padding: wp(2),
    backgroundColor:"#fafafa",
    alignItems: "center",
    borderRadius: 20,
    marginTop: hp(2),
  },
  backButtonText: {
    fontWeight:"bold",
  },
  input: {
    marginTop: hp(4),
    borderWidth: 1,
    borderColor: "#ddd",
    padding: wp(.5),
    marginVertical: hp(1),
  },
  image: {
    width: 300,
    height: 200,
    margin: wp(2),
  },
  imagePlaceholder: {
    height: hp(20),
    justifyContent: "center",
    alignItems: "center",
    marginVertical: hp(1),
    borderWidth: 1,
    borderColor: "#ddd",
    textAlign: "center",
    padding: wp(2),
  },
  saveButton: {
    backgroundColor: "#4F75FF",
    padding: wp(2),
    alignItems: "center",
    borderRadius: 20,
    marginTop: hp(2),
    
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
