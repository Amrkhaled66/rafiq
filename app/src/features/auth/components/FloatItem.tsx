import { Text, View, Image, ImageSourcePropType } from "react-native";
import { AppFonts } from "@/shared/theme/theme";

const FloatItem = ({
  image,
  title,
  imageClassName,
  position,
}: {
  image: ImageSourcePropType;
  title: string;
  imageClassName: string;
  position: string;
}) => {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 8,
      }}
      className={`flex-col items-center gap-2 rounded-lg bg-white px-4 py-2 drop-shadow-md ${position}`}
    >
      <Image source={image} className={imageClassName} />
      <Text
        style={{
          fontFamily: AppFonts.ar.bold,
        }}
        className="text-sm text-[#6b6b6b]"
      >
        {title}
      </Text>
    </View>
  );
};

export default FloatItem;
