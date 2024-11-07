import { useRouter } from "next/navigation";

interface ContentCardProps {
    id: string;
    title: string;
    type: string;
    imageUrl: string;
}

const ContentCard = ({ id, title, type, imageUrl }: ContentCardProps) => {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/content/${id}`);
    };

    return (
        <div 
            onClick={handleClick} 
            className="border rounded-lg shadow-lg p-4 bg-white w-full max-w-md cursor-pointer hover:shadow-2xl transition-shadow duration-300"
        >
            {/* Imagen en la parte superior */}
            <img 
                src={imageUrl} 
                alt={`${title} cover`} 
                className="w-full h-48 object-cover rounded-t-lg mb-4"
            />
            
            {/* Texto de título y tipo */}
            <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                <p className="text-sm text-gray-600">{type}</p>
            </div>
        </div>
    );
};

export default ContentCard;