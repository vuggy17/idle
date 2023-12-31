import { Flex, List, Typography } from 'antd';
import PartialAvatar from '../../../../../components/UserCard/PartialAvatar';

export default function ConversationItem({
  isActive,
  title,
  img,
  sub,
  lastUpdatedAt,
}: {
  isActive: boolean;
  title: string;
  img: string;
  sub: string;
  lastUpdatedAt: number;
}) {
  return (
    <List.Item className={`min-w-0 ${isActive ? 'active' : ''}`}>
      <Flex align="center" className="min-w-0 px-4">
        <PartialAvatar src={img || title} className="shrink-0 mr-2" />
        <div className="flex-1 basis-0 min-w-0">
          <div className="flex">
            <Typography.Text ellipsis className="inline">
              {title}
            </Typography.Text>
            <Typography.Text type="secondary" className="text-xs inline">
              {lastUpdatedAt}
            </Typography.Text>
          </div>
          <Typography.Text type="secondary" ellipsis>
            {sub}
          </Typography.Text>
        </div>
      </Flex>
    </List.Item>
  );
}
