interface ContentCardProps {
    id: string;
    title: string;
    type: string;
  }
  
  const ContentCard = ({ id, title, type }: ContentCardProps) => {
    return (
      <div className="border rounded-lg shadow-lg p-4 bg-white w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-600">{type}</p>
      </div>
    );
  };
  
  export default ContentCard;  