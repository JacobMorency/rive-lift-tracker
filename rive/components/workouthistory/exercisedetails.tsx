"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { View, Text, Pressable } from "react-native";
import { Set } from "@/types/workout";
import Button from "../button";

type ExerciseDetailsProps = {
  exerciseName: string;
  sets: Set[];
};

const ExerciseDetails = ({ exerciseName, sets }: ExerciseDetailsProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <View className="border-t border-base-300 py-2">
      <View className="flex-row items-center justify-between">
        <Text className="font-medium text-base-content">
          {exerciseName} – {sets.length} {sets.length === 1 ? "Set" : "Sets"}
        </Text>
        <Pressable
          className="btn btn-ghost btn-sm"
          onPress={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <ChevronUp stroke={"white"} />
          ) : (
            <ChevronDown stroke={"white"} />
          )}
        </Pressable>
      </View>

      {isOpen && (
        <View className="px-4 py-2 space-y-1">
          {sets.map((set) => (
            <Text key={set.id} className="text-sm text-primary-content">
              Set {set.set_number}: {set.reps} {set.reps === 1 ? "rep" : "reps"}{" "}
              at {set.weight}lbs
              {set.partialReps != null && set.partialReps > 0 && (
                <Text>
                  {" "}
                  + {set.partialReps}{" "}
                  {set.partialReps === 1 ? "partial" : "partials"}
                </Text>
              )}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

export default ExerciseDetails;
