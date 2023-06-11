import Image from "next/image";
import Link from "next/link";

type RankBadgeProps = {
  rank: string;
  name: string;
  color: string;
  link: string;
};

const RankBadge: React.FC<RankBadgeProps> = ({ rank, name, color, link }) => {
  return (
    <Link href={link}>
      <Image src={`/assets/images/ranks/${rank}.svg`} width={20} height={20} alt={rank} />
      <span style={{ color: `#${color}`, fontWeight: "bold" }}>{name}</span>
    </Link>
  );
};

export default RankBadge;
