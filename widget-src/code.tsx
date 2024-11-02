const { widget } = figma;
const { useSyncedState, AutoLayout, Text, Frame, Image } = widget;

// Initial data structure
const initialData = [
  {
    name: "REVIEWERS",
    items: [
      { text: "Design reviewed by", completed: false, modifiedBy: "", modifiedDate: "" },
      { text: "Copy reviewed by", completed: false, modifiedBy: "", modifiedDate: "" },
      { text: "Design system usage reviewed by", completed: false, modifiedBy: "", modifiedDate: "" },
      { text: "Creatives reviewed by", completed: false, modifiedBy: "", modifiedDate: "" },
    ],
  },
  {
    name: "DESIGN SYSTEM",
    items: [
      { text: "Component usage coverage is greater than 80%", completed: false, modifiedBy: "", modifiedDate: "" },
      { text: "Annotated the reasons for deviations if coverage is less than 80%", completed: false, modifiedBy: "", modifiedDate: "" },
      { text: "Used corresponding typography style defined in design system file", completed: false, modifiedBy: "", modifiedDate: "" },
      { text: "All the non-design system components are approved from the design system team and are part of iterations branch", completed: false, modifiedBy: "", modifiedDate: "" },
    ],
  },
  {
    name: "STATES",
    items: [
      { text: "Empty and loading states are defined properly", completed: false, modifiedBy: "", modifiedDate: "" },
      { text: "Accounted for edge cases and error cases", completed: false, modifiedBy: "", modifiedDate: "" },
      { text: "Added figma’s annotations to explain behaviours", completed: false, modifiedBy: "", modifiedDate: "" },
      { text: "Ensured responsive design for both desktop and mobile flows, considering standard screen sizes, safe areas and keyboard layouts on mobile devices", completed: false, modifiedBy: "", modifiedDate: "" },
    ],
  },
];

function Widget() {
  const [checklist, setChecklist] = useSyncedState("checklist", initialData);

  const toggleItem = (categoryIndex: number, itemIndex: number) => {
    const newChecklist = JSON.parse(JSON.stringify(checklist));
    const item = newChecklist[categoryIndex].items[itemIndex];

    item.completed = !item.completed;

    // Only set `modifiedBy` and `modifiedDate` if they are initially empty or if there's a state change (checked/unchecked)
    if (!item.modifiedBy || item.completed !== checklist[categoryIndex].items[itemIndex].completed) {
      item.modifiedBy = figma.currentUser ? figma.currentUser.name : "Unknown User";
      item.modifiedDate = new Date().toLocaleString();
    }

    setChecklist(newChecklist);
  };

  // Count completed items
  const totalItems = checklist.reduce((sum, category) => sum + category.items.length, 0);
  const checkedItems = checklist.reduce(
    (sum, category) => sum + category.items.filter((item) => item.completed).length,
    0
  );

  return (
    <AutoLayout
      direction="vertical"
      verticalAlignItems="start"
      spacing={16}
      fill="#FFFFFF"
      stroke="#E6E6E6"
      width={650}
      cornerRadius={16}
    >
      <AutoLayout padding={{ left: 24, right: 24, top: 24 }} width="fill-parent">
        <Text fontSize={18} fontWeight={700} fill="#111111">
          📋 Dev Handoff Checklist
        </Text>
      </AutoLayout>

      {/* Divider */}
      <Frame width="fill-parent" height={1} fill="#E6E6E6" />

      {checklist.map((category, categoryIndex) => (
        <AutoLayout key={categoryIndex} direction="vertical" padding={{ left: 24, right: 24 }} spacing={16} width="fill-parent">
          <Text fontSize={14} fontWeight={700} textDecoration="underline" fill="#111111">
            {category.name}
          </Text>
          {category.items.map((item, itemIndex) => (
            <AutoLayout
              key={itemIndex}
              width="fill-parent"
              spacing={8}
              verticalAlignItems="start"
              padding={{ vertical: 8, left: 16, right: 16 }}
              onClick={() => toggleItem(categoryIndex, itemIndex)}
              hoverStyle={{ fill: "#f9f9f9" }}
            >
              {/* Custom Checkbox Simulation */}
              <AutoLayout
                width={20}
                height={20}
                cornerRadius={3}
                fill={item.completed ? "#12B76A" : "#FFFFFF"}
                stroke={item.completed ? "#12B76A" : "#CCCCCC"}
                strokeWidth={1}
                horizontalAlignItems="center"
                verticalAlignItems="center"
              >
                {item.completed && (
                  <AutoLayout padding={{ bottom: 1, right: 1 }}>
                    <Text fill="#FFFFFF" fontSize={13} fontWeight="bold" horizontalAlignText="center" verticalAlignText="center">
                      ✓
                    </Text>
                  </AutoLayout>
                )}
              </AutoLayout>

              <AutoLayout direction="vertical" spacing={8} width="fill-parent">
                {/* Task Text */}
                <Text fontSize={14} fill={item.completed ? "#888888" : "#111111"} width="fill-parent" textDecoration={item.completed ? "strikethrough" : "none"}>
                  {item.text}
                </Text>

                {/* Secondary Information */}
                <Text fontSize={12} fill="#888888" width="fill-parent">
                  {item.completed ? "Modified" : "Unchecked"} · {item.modifiedBy || "No modifier"} · {item.modifiedDate || "Not modified"}
                </Text>
              </AutoLayout>
            </AutoLayout>
          ))}
          {/* Adding spacing between sections */}
          <Frame width="fill-parent" height={12} fill="#FFFFFF" />
        </AutoLayout>
      ))}

      {/* Divider */}
      <Frame width="fill-parent" height={1} fill="#E6E6E6" />

      {/* Counter of checked items */}
      <AutoLayout direction="horizontal" spacing={8} padding={{ left: 32, right: 32, bottom: 32, top:8 }} width="fill-parent" verticalAlignItems="center">
        <Text fontSize={14} fontWeight={600} fill="#666666" width="fill-parent">
          🏁  Completed Checklist(s) {checkedItems} of {totalItems}
        </Text>
      </AutoLayout>
    </AutoLayout>
  );
}

widget.register(Widget);
