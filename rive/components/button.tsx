import { Text, Pressable } from "react-native";

type ButtonProps = {
  children: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  className?: string;
  variant?: "primary" | "secondary" | "error";
};

export default function Button({
  children,
  onPress,
  disabled = false,
  className = "",
  variant = "primary",
}: ButtonProps) {
  const baseStyle = "rounded-md px-4 py-2";

  const variantStyles = {
    primary: "bg-primary text-primary-content",
    secondary: "bg-secondary text-secondary-content",
    error: "bg-error text-error-content",
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`${baseStyle} ${variantStyles[variant]} ${className}`}
    >
      <Text className={`text-${variant}-content text-center text-lg font-bold`}>
        {children}
      </Text>
    </Pressable>
  );
}
