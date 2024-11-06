interface ContentCardProps {
    id: string;
    title: string;
    type: string;
  }
  
const ContentCard = ({ id, title, type }: ContentCardProps) => {
    return (
      <div className="border rounded-lg shadow-lg bg-white w-full max-w-md">
        {/* Imagen en la parte superior */}
        <div
          className="h-48 rounded-t-lg"
          style={{
            backgroundImage: `url("https://via.placeholder.com/300")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        
        {/* Contenido debajo de la imagen */}
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-600">{type}</p>
        </div>
      </div>
    );
};
  
export default ContentCard;  