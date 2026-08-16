import { View, Image, ImageSourcePropType } from "react-native";
import { AppText } from "@/shared/ui/app-text";
import { useAppTheme } from "@/shared/theme/appearance-provider";

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
  const { colors } = useAppTheme();

  return (
    <View
      style={{
        backgroundColor: colors.card,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 8,
      }}
      className={`flex-col items-center gap-2 rounded-lg bg-card px-4 py-2 drop-shadow-md ${position}`}
    >
      <Image source={image} className={imageClassName} />
      <AppText className="text-sm" tone="muted" weight="bold">
        {title}
      </AppText>
    </View>
  );
};

export default FloatItem;
