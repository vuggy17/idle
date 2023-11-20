import { Image } from 'antd';

export default function ThemeCard({
  value,
  name,
}: {
  value: string;
  name: string;
}) {
  return (
    <Image
      preview={false}
      src="https://placehold.co/600x400"
      width={120}
      height={80}
      // className={`object-cover outline outline-transparent hover:outline-[${token.colorPrimaryBgHover}] rounded-md`}
      className="inset-0 object-cover outline outline-transparent hover:outline-[#1677ff] rounded-md"
    />
  );
}
