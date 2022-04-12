import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { reaction, Ref, Transaction } from "reactronic";
import { App } from "models/app/App";
import { Bool } from "common/constants";

export class InputComponent extends React.Component<
  {
    model?: Ref;
    value: Ref<string | number | undefined>;
    iconNameArr: string[];
    placeholder: string;
    errMsg: string;
    modal?: Ref<string | number | undefined>;
  },
  { text: string; isErr: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      text: "",
      isErr: false,
    };
  }
  @reaction
  render() {
    const { isErr, text } = this.state;
    const { model, placeholder, value, errMsg, iconNameArr } = this.props;
    const u = Ref.to(App.user);
    const iconName = model?.value?.length > 0 ? iconNameArr[0] : iconNameArr[1];
    const iconColor = model?.value?.length > 0 ? "green" : "red";
    const mu = Ref.to(u.edited);
    return (
      <View style={{ width: "90%" }}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            defaultValue={text}
            placeholder={placeholder}
            onChangeText={(value) =>
              Transaction.run(() => {
                if (model) {
                  if (typeof model.value === "number") {
                    model.value = value ? Bool.True : Bool.False;
                  } else {
                    model.value = value;
                  }
                }
              })
            }
          />
          {model?.value?.length > 0 && (
            <View style={{ padding: 5 }}>
              <Icon name={iconName} size={15} color={iconColor} />
            </View>
          )}
        </View>

        <Text
          style={{
            fontSize: 12,
            color: "red",
            alignSelf: "flex-start",
            paddingLeft: 8,
          }}
        >
          {isErr !== true && errMsg}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderRadius: 45,
    height: 35,
    backgroundColor: "#fff",
    marginTop: 20,
  },
  input: {
    borderRadius: 45,
    backgroundColor: "#fff",
    color: "black",
    fontSize: 8,
    lineHeight: 13,
    width: "90%",
    height: "100%",
    fontWeight: "500",
    paddingLeft: 20,
  },
});
