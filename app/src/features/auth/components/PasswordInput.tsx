import { Ionicons } from "@expo/vector-icons";
import { forwardRef, useState } from "react";
import { Pressable, TextInput, View, type TextInputProps } from "react-native";

import AuthInput from "@/features/auth/components/AuthInput";

type PasswordInputProps = Omit<TextInputProps, "secureTextEntry" | "style"> & {
  label: string;
  error?: string;
  notShowingIcon?: boolean;
};

const PasswordInput = forwardRef<TextInput, PasswordInputProps>(
  function PasswordInput({ notShowingIcon, ...props }, ref) {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <AuthInput
        ref={ref}
        {...props}
        iconName="lock-closed-outline"
        secureTextEntry={!showPassword}
        trailingElement={
          <View className="size-10 flex-row ">
            <Pressable
              onPress={() => setShowPassword((current) => !current)}
              className="h-10 w-10 items-center justify-center"
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={
                showPassword ? "Hide password" : "Show password"
              }
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#616161"
              />
            </Pressable>
          </View>
        }
      />
    );
  },
);

export default PasswordInput;
