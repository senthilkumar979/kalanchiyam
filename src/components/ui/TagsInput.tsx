import React, { KeyboardEvent, useEffect, useState } from "react";

interface TagsInputProps {
  maxTags?: number;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const TagsInput: React.FC<TagsInputProps> = ({
  maxTags = 3,
  value = "",
  onChange,
  placeholder = "Add a tag...",
  className = "",
}) => {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  // Initialize tags from value prop
  useEffect(() => {
    if (value) {
      const tagsArray = value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
      setTags(tagsArray);
    } else {
      setTags([]);
    }
  }, [value]);

  const addTag = (newTag: string) => {
    if (!tags.includes(newTag)) {
      const newTags = [...tags, newTag];
      setTags(newTags);
      onChange?.(newTags.join(", "));
    }
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    onChange?.(newTags.join(", "));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const newTag = inputValue.trim();

      if (newTag !== "" && tags.length < maxTags) {
        addTag(newTag);
        setInputValue("");
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-wrap items-center border border-gray-300 rounded-md p-2 space-x-2">
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm"
            >
              <span>{tag}</span>
              <button
                type="button"
                className="ml-2 text-blue-500 hover:text-blue-700"
                onClick={() => removeTag(index)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={tags.length >= 1 ? "" : placeholder}
          className="flex-1 border-none outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
          onKeyDown={handleKeyDown}
          disabled={tags.length >= maxTags}
        />
      </div>
    </div>
  );
};

export default TagsInput;
