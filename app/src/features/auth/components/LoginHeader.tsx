import { Image, View } from "react-native";

import authBg from "@assets/images/auth-bg.png";

export default function LoginHeader() {
  return (
    <View className="relative h-[45%] items-center justify-end overflow-hidden sm:h-[50%]">
      <View>
        <Image className="h-full max-w-screen" source={authBg} />
      </View>
    </View>
  );
}
