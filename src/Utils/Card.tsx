export function StatCard({
  title,
  value,
  icon,
  sub,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  sub: string;
}) {
  return (
    <div className="bg-white p-4 rounded-lg border border-neutral-200">
      <div className="flex justify-between items-center">
        <h3 className="text-neutral-600 font-medium">{title}</h3>
        <div className="text-neutral-700">{icon}</div>
      </div>
      <p className="text-2xl font-semibold mt-2">{value}</p>
      <p className="text-sm text-neutral-600 mt-1">{sub}</p>
    </div>
  );
}

export function ChartCard({
  title,
  placeholder,
  data,
}: {
  title: string;
  placeholder: string;
  data?: any[];
}) {
  return (
    <div className="bg-white p-4 rounded-lg border border-neutral-200">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div className="h-[300px] bg-neutral-100 rounded-lg flex items-center justify-center">
        {data && data.length > 0 ? (
          <div className="w-full h-full p-4">
            <div className="flex items-end justify-between h-full gap-2">
              {data.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="bg-neutral-800 rounded-t w-full"
                    style={{ 
                      height: `${Math.max((item.count / Math.max(...data.map(d => d.count))) * 200, 20)}px` 
                    }}
                  ></div>
                  <span className="text-xs text-neutral-600 mt-2">
                    {item._id.month}/{item._id.year}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <span className="text-neutral-600">{placeholder}</span>
        )}
      </div>
    </div>
  );
}

export function Activity({
  icon,
  text,
  time,
}: {
  icon: React.ReactNode;
  text: string;
  time: string;
}) {
  return (
    <div className="flex items-center gap-4 p-3 hover:bg-neutral-50 rounded-lg">
      <div className="text-neutral-700">{icon}</div>
      <div>
        <p className="text-sm">{text}</p>
        <p className="text-xs text-neutral-600">{time}</p>
      </div>
    </div>
  );
}
