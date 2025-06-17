import { useState, useEffect } from "react";
import supabase from "../../lib/supabaseClient";
import { Dumbbell, ArrowLeft } from "lucide-react-native";
import { ExercisesInWorkout, Exercise } from "@/types/workout";
import { debounce } from "lodash";
import { useAuth } from "../../hooks/useAuth";
import ExerciseSelectorButton from "./exerciseselectorbutton";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Switch,
} from "react-native";

type ExerciseSelectorProps = {
  exerciseName: string;
  setExerciseName: (name: string) => void;
  setExerciseId: (id: number) => void;
  isSetUpdating: boolean;
  isSetsEmpty: boolean;
  exercisesInWorkout: ExercisesInWorkout[];
};

type ExerciseOption = {
  id: number;
  name: string;
  category: string;
}[];

const ExerciseSelector = ({
  exerciseName,
  setExerciseName,
  setExerciseId,
  isSetUpdating,
  isSetsEmpty,
  exercisesInWorkout,
}: ExerciseSelectorProps) => {
  const [exerciseOptions, setExerciseOptionsState] = useState<ExerciseOption>(
    []
  );
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [favoriteExercises, setFavoriteExercises] = useState<ExerciseOption>(
    []
  );
  const [favoriteExerciseIds, setFavoriteExerciseIds] = useState<Set<number>>(
    new Set()
  );
  const [modalVisible, setModalVisible] = useState(false);

  const { user } = useAuth();

  const fetchExercises = async (
    searchTerm: string,
    filter: string
  ): Promise<void> => {
    try {
      let query = supabase
        .from("exercise_library")
        .select("*")
        .order("name", { ascending: true });

      if (filter === "Arms") {
        query = query.in("category", ["Biceps", "Triceps", "Shoulders"]);
      } else if (filter) {
        query = query.eq("category", filter);
      }

      const { data, error } = await query
        .ilike("name", `%${searchTerm}%`)
        .range(0, 30);

      if (error) {
        console.error("Error fetching exercises:", error.message);
        return;
      }

      setExerciseOptionsState(data);
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const debouncedFetch = debounce((term: string, filter: string) => {
    fetchExercises(term, filter);
  }, 300);

  useEffect(() => {
    debouncedFetch(searchValue, selectedFilter);
    return () => {
      debouncedFetch.cancel();
    };
  }, [searchValue, selectedFilter]);

  const filteredExercises = exerciseOptions.filter((ex) =>
    ex.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSelect = (exercise: Exercise): void => {
    setExerciseName(exercise.name);
    setExerciseId(exercise.id);
    setModalVisible(false);
  };

  useEffect(() => {
    const getFavoriteExercises = async () => {
      if (!user) return;

      try {
        const { data: favs, error: favError } = await supabase
          .from("favorite_exercises")
          .select("exercise_id")
          .eq("user_id", user.id);

        if (favError) {
          console.error(
            "Error fetching favorite exercise IDs:",
            favError.message
          );
          return;
        }

        const ids = favs.map((f) => f.exercise_id);
        setFavoriteExerciseIds(new Set(ids));

        if (ids.length > 0) {
          const { data: exercises, error: exError } = await supabase
            .from("exercise_library")
            .select("*")
            .in("id", ids);

          if (exError) {
            console.error("Error fetching exercises:", exError.message);
            return;
          }

          setFavoriteExercises(exercises);
        } else {
          setFavoriteExercises([]);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    getFavoriteExercises();
  }, [user]);

  return (
    <View className="w-full">
      <TouchableOpacity
        disabled={isSetUpdating}
        onPress={() => {
          if (!isSetsEmpty) {
            return;
          }
          setModalVisible(true);
        }}
        className="bg-primary w-full h-12 rounded items-center justify-center flex-row"
      >
        <Text className="text-white">
          {exerciseName || "Select an Exercise"}
        </Text>
        <Dumbbell size={16} stroke={"white"} style={{ marginLeft: 10 }} />
      </TouchableOpacity>

      <Modal animationType="slide" visible={modalVisible}>
        <View className="flex-1 p-4 bg-base-100">
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            className="absolute top-4 left-4"
          >
            <ArrowLeft size={24} />
          </TouchableOpacity>
          <Text className="text-center text-lg font-bold mb-4">
            Select an Exercise
          </Text>
          <TextInput
            placeholder="Search exercises"
            value={searchValue}
            onChangeText={setSearchValue}
            className="border border-primary-content text-primary-content rounded-md p-3 w-full"
          />
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-base-content">Show Favorites Only</Text>
            <Switch
              value={showFavoritesOnly}
              onValueChange={setShowFavoritesOnly}
            />
          </View>
          <ScrollView className="flex-1">
            {(showFavoritesOnly ? favoriteExercises : filteredExercises).map(
              (exercise) => (
                <TouchableOpacity
                  key={exercise.id}
                  onPress={() => handleSelect(exercise)}
                  className="p-3 border-b border-gray-200"
                >
                  <Text className="text-base-content">{exercise.name}</Text>
                </TouchableOpacity>
              )
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default ExerciseSelector;
