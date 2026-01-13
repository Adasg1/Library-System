import React, { useEffect, useState } from 'react';
import { categoryService } from "../services/categoryService";
import FilterListIcon from '@mui/icons-material/FilterList';
import CategoryIcon from '@mui/icons-material/Category';
import ArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const CategoriesSideBar = ({ selectedCategory, onSelectCategory }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryService.getAllCategories();
                setCategories(data);
            } catch (error) {
                console.error("Nie udało się pobrać kategorii:", error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <nav className="flex flex-col space-y-1">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-3 mt-2">
                Filtruj wg kategorii
            </h2>

            {/* Opcja: WSZYSTKIE */}
            <button
                onClick={() => onSelectCategory(null)}
                className={`flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group border border-transparent ${
                    selectedCategory === null
                        ? 'bg-blue-50 text-blue-700 shadow-sm'
                        : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
                <div className="flex items-center">
                    <FilterListIcon
                        className={`mr-3 transition-colors ${selectedCategory === null ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}`}
                        fontSize="small"
                    />
                    <span>Wszystkie książki</span>
                </div>
                {selectedCategory === null && <ArrowRightIcon fontSize="small" className="text-blue-500" />}
            </button>

            {/* Separator */}
            <div className="my-2 border-b border-gray-100 mx-3"></div>

            {/* Lista Kategorii */}
            {categories.map((category) => {
                const isSelected = selectedCategory?.categoryId === category.categoryId;

                return (
                    <button
                        key={category.categoryId}
                        onClick={() => onSelectCategory(category)}
                        className={`flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group border border-transparent ${
                            isSelected
                                ? 'bg-blue-50 text-blue-700 shadow-sm'
                                : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                        <div className="flex items-center">
                            <CategoryIcon
                                className={`mr-3 transition-colors ${isSelected ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}`}
                                fontSize="small"
                            />
                            <span className="truncate">{category.categoryName}</span>
                        </div>
                        {isSelected && <ArrowRightIcon fontSize="small" className="text-blue-500" />}
                    </button>
                );
            })}
        </nav>
    );
};

export default CategoriesSideBar;