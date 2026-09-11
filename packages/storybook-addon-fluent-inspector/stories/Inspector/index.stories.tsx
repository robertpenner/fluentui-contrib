import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  Button,
  Card,
  CardFooter,
  CardHeader,
  Field,
  Input,
  Text,
} from '@fluentui/react-components';

const meta = {
  title: 'Fluent Inspector/Runtime discovery',
  parameters: {
    layout: 'centered',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const NestedFluentComponents: Story = {
  render: () => (
    <Card style={{ width: 420 }}>
      <CardHeader
        header={<Text weight="semibold">Inspector target</Text>}
        description={<Text size={200}>Nested Fluent v9 components</Text>}
      />

      <Accordion collapsible defaultOpenItems={['settings']}>
        <AccordionItem value="settings">
          <AccordionHeader size="large">Settings</AccordionHeader>
          <AccordionPanel>
            <Field label="Display name">
              <Input defaultValue="Ada Lovelace" />
            </Field>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      <CardFooter>
        <Button appearance="primary">Save</Button>
        <Button appearance="secondary">Cancel</Button>
      </CardFooter>
    </Card>
  ),
};
