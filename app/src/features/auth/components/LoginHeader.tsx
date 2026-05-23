import { Image, View } from "react-native";
import authBg from "@assets/images/auth-bg.png";
export default function LoginHeader() {
  return (
    <View className="relative flex h-[50%] items-center justify-end overflow-hidden sm:h-[65%]">
      <View className="">
        <Image
          className="h-full max-w-screen sm:-translate-y-15"
          source={authBg}
        />
      </View>
    </View>
  );
}
