import {
  DebounceSelectProps,
  DebounceSelect,
} from '../../../components/debounce-select';
import HttpProvider from '../../../providers/http';

type PeoplePickerProps = {
  showRemoveIcon?: boolean;
  onChange?: DebounceSelectProps['onChange'];
  value?: DebounceSelectProps['value'];
};
const FORCE_USE_DEFAULT_ICON = undefined;
export default function PeoplePicker({
  showRemoveIcon = true,
  ...props
}: PeoplePickerProps) {
  return (
    <DebounceSelect
      prefetch
      mode="multiple"
      placeholder="Select users"
      fetchOptions={fetchUserList}
      style={{ width: '100%' }}
      removeIcon={showRemoveIcon ? FORCE_USE_DEFAULT_ICON : null} // if set to undefined, the component lib use its default one
      {...props}
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
