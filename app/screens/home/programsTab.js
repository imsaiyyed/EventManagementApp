import React from 'react';
import { RkAvoidKeyboard, RkStyleSheet } from 'react-native-ui-kitten';
import { Tabs, Tab, Icon, Text, TabHeading } from "native-base";

export class ProgramsTab extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    return (
      <Tabs style={{ elevation: 3 }}>
        <Tab
          heading={
            <TabHeading><Icon name="calendar"/><Text>Schedule</Text></TabHeading>
          }
        >
          <Text> Schedule </Text>
        </Tab>
        <Tab
          heading={
            <TabHeading><Icon name="ios-link"/><Text>My Agenda</Text></TabHeading>
          }
        >
          <Text> My Agenda </Text>
        </Tab>
      </Tabs>
    );
  }
}

let styles = RkStyleSheet.create(theme => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.screen.base
  },
}));