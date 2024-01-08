import {
  DebounceSelectProps,
  DebounceSelect,
} from '../../../../components/DebounceSelect';
import HttpProvider from '../../../../providers/http';

type PeoplePickerProps = {
  onChange?: DebounceSelectProps['onChange'];
};

export default function PeoplePicker({ ...props }: PeoplePickerProps) {
  return (
    <DebounceSelect
      prefetch
      mode="multiple"
      placeholder="Select users"
      fetchOptions={fetchUserList}
      onChange={(newValue, option) => {
        props.onChange?.(newValue, option);
      }}
      style={{ width: '100%' }}
    />
  );
}

async function fetchUserList(username: string) {
  const friends = await HttpProvider.findFriends({ q: username.trim() });

  return friends.map((f) => ({
    label: f.name,
    value: f.id,
    other: f,
  }));
}
