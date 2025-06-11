// FuelIQ Smart Pantry Module with Barcode Scanning
// Save this as: pantry-tab.js

(function() {
    // Prevent multiple loading
    if (window.FuelIQPantry) {
        return;
    }

    // Safe Storage Functions
    const isLocalStorageAvailable = () => {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    };

    const memoryStorage = {};

    const savePantryData = (data) => {
        const key = 'fueliq_pantry';
        const dataStr = JSON.stringify(data);
        
        if (isLocalStorageAvailable()) {
            try {
                localStorage.setItem(key, dataStr);
            } catch (e) {
                console.warn('localStorage failed, using memory storage:', e);
                memoryStorage[key] = dataStr;
            }
        } else {
            memoryStorage[key] = dataStr;
        }
    };

    const loadPantryData = () => {
        const key = 'fueliq_pantry';
        let data = null;
        
        if (isLocalStorageAvailable()) {
            try {
                data = localStorage.getItem(key);
            } catch (e) {
                console.warn('localStorage failed, using memory storage:', e);
                data = memoryStorage[key];
            }
        } else {
            data = memoryStorage[key];
        }
        
        return data ? JSON.parse(data) : {
            items: [],
            categories: ['Produce', 'Dairy', 'Meat & Seafood', 'Pantry Staples', 'Frozen', 'Beverages', 'Snacks', 'Other']
        };
    };

    // Barcode API Functions
    const lookupBarcode = async (barcode) => {
        try {
            // Try Open Food Facts first
            const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
            const data = await response.json();
            
            if (data.status === 1 && data.product) {
                const product = data.product;
                return {
                    name: product.product_name || product.product_name_en || 'Unknown Product',
                    brand: product.brands || '',
                    category: product.categories_tags?.[0]?.replace('en:', '') || 'Other',
                    image: product.image_url || product.image_front_url || null,
                    barcode: barcode,
                    source: 'openfoodfacts'
                };
            }
            
            // Fallback to UPC database (mock for demo)
            return {
                name: `Product ${barcode.slice(-4)}`,
                brand: 'Unknown Brand',
                category: 'Other',
                image: null,
                barcode: barcode,
                source: 'fallback'
            };
        } catch (error) {
            console.error('Barcode lookup failed:', error);
            return {
                name: `Product ${barcode.slice(-4)}`,
                brand: 'Unknown Brand',
                category: 'Other',
                image: null,
                barcode: barcode,
                source: 'error'
            };
        }
    };

    // Helper Functions
    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    const getDaysUntilExpiry = (expiryDate) => {
        if (!expiryDate) return null;
        const today = new Date();
        const expiry = new Date(expiryDate);
        const diffTime = expiry - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const getExpiryStatus = (expiryDate) => {
        const days = getDaysUntilExpiry(expiryDate);
        if (!days) return { status: 'none', color: 'gray', text: 'No expiry date' };
        if (days < 0) return { status: 'expired', color: 'red', text: 'Expired' };
        if (days <= 3) return { status: 'urgent', color: 'red', text: `${days} days left` };
        if (days <= 7) return { status: 'warning', color: 'yellow', text: `${days} days left` };
        return { status: 'good', color: 'green', text: `${days} days left` };
    };

    // Barcode Scanner Component
    const BarcodeScanner = ({ onScan, onClose }) => {
        const [isScanning, setIsScanning] = React.useState(false);
        const [error, setError] = React.useState('');
        const [manualBarcode, setManualBarcode] = React.useState('');
        const videoRef = React.useRef(null);
        const streamRef = React.useRef(null);

        React.useEffect(() => {
            return () => {
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => track.stop());
                }
            };
        }, []);

        const startCamera = async () => {
            try {
                setError('');
                setIsScanning(true);
                
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: 'environment' } // Use back camera
                });
                
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error('Camera access failed:', err);
                setError('Camera access denied. Please allow camera permission and try again.');
                setIsScanning(false);
            }
        };

        const stopCamera = () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
            setIsScanning(false);
        };

        const handleManualEntry = () => {
            if (manualBarcode.trim()) {
                onScan(manualBarcode.trim());
                onClose();
            }
        };

        // Mock barcode detection (in a real app, you'd use a library like QuaggaJS)
        const simulateScan = () => {
            const mockBarcodes = [
                '0123456789012',
                '0737628064502', // Honey Nut Cheerios
                '0016000275157', // Diet Coke
                '0041196891171'  // Bananas
            ];
            const randomBarcode = mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)];
            onScan(randomBarcode);
            onClose();
        };

        return React.createElement('div', { 
            className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50' 
        },
            React.createElement('div', { 
                className: 'bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col' 
            },
                React.createElement('div', { className: 'flex justify-between items-center mb-4' },
                    React.createElement('h3', { className: 'text-xl font-bold text-gray-800' }, 'Scan Barcode'),
                    React.createElement('button', { 
                        onClick: onClose,
                        className: 'text-gray-500 hover:text-gray-700 text-xl font-bold' 
                    }, '×')
                ),

                // Camera Section
                React.createElement('div', { className: 'mb-6' },
                    !isScanning ? 
                        React.createElement('div', { className: 'text-center' },
                            React.createElement('div', { className: 'w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4' },
                                React.createElement('span', { className: 'text-4xl' }, '📷')
                            ),
                            React.createElement('button', {
                                onClick: startCamera,
                                className: 'w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold mb-3'
                            }, 'Start Camera'),
                            React.createElement('button', {
                                onClick: simulateScan,
                                className: 'w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-sm'
                            }, '🎯 Demo: Scan Random Product')
                        ) :
                        React.createElement('div', { className: 'relative' },
                            React.createElement('video', {
                                ref: videoRef,
                                autoPlay: true,
                                playsInline: true,
                                className: 'w-full h-48 bg-black rounded-lg object-cover'
                            }),
                            React.createElement('div', { className: 'absolute inset-0 flex items-center justify-center' },
                                React.createElement('div', { className: 'w-32 h-20 border-2 border-orange-500 rounded-lg' })
                            ),
                            React.createElement('div', { className: 'text-center mt-3' },
                                React.createElement('p', { className: 'text-sm text-gray-600 mb-3' }, 'Point camera at barcode'),
                                React.createElement('button', {
                                    onClick: stopCamera,
                                    className: 'bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg'
                                }, 'Stop Camera')
                            )
                        )
                ),

                error && React.createElement('div', { className: 'bg-red-50 border border-red-200 rounded-lg p-3 mb-4' },
                    React.createElement('p', { className: 'text-red-700 text-sm' }, error)
                ),

                // Manual Entry Section
                React.createElement('div', { className: 'border-t pt-4' },
                    React.createElement('h4', { className: 'font-semibold text-gray-700 mb-3' }, 'Or enter manually:'),
                    React.createElement('div', { className: 'flex gap-2' },
                        React.createElement('input', {
                            type: 'text',
                            value: manualBarcode,
                            onChange: (e) => setManualBarcode(e.target.value),
                            placeholder: 'Enter barcode number',
                            className: 'flex-1 px-3 py-2 border border-gray-300 rounded-lg'
                        }),
                        React.createElement('button', {
                            onClick: handleManualEntry,
                            disabled: !manualBarcode.trim(),
                            className: 'bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg'
                        }, 'Add')
                    )
                )
            )
        );
    };

    // Add Item Form Component
    const AddItemForm = ({ productData, onAdd, onCancel }) => {
        const [formData, setFormData] = React.useState({
            name: productData?.name || '',
            brand: productData?.brand || '',
            category: productData?.category || 'Other',
            quantity: 1,
            unit: 'pcs',
            expiryDate: '',
            purchaseDate: formatDate(new Date()),
            notes: '',
            barcode: productData?.barcode || ''
        });

        const handleSubmit = (e) => {
            e.preventDefault();
            if (formData.name.trim()) {
                onAdd({
                    ...formData,
                    id: Date.now(),
                    addedDate: new Date().toISOString(),
                    image: productData?.image || null
                });
            }
        };

        const categories = ['Produce', 'Dairy', 'Meat & Seafood', 'Pantry Staples', 'Frozen', 'Beverages', 'Snacks', 'Other'];
        const units = ['pcs', 'lbs', 'oz', 'kg', 'g', 'L', 'mL', 'cups', 'tbsp', 'tsp'];

        return React.createElement('div', { 
            className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50' 
        },
            React.createElement('div', { 
                className: 'bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto' 
            },
                React.createElement('div', { className: 'flex justify-between items-center mb-4' },
                    React.createElement('h3', { className: 'text-xl font-bold text-gray-800' }, 'Add to Pantry'),
                    React.createElement('button', { 
                        onClick: onCancel,
                        className: 'text-gray-500 hover:text-gray-700 text-xl font-bold' 
                    }, '×')
                ),

                productData?.image && React.createElement('div', { className: 'mb-4' },
                    React.createElement('img', {
                        src: productData.image,
                        alt: productData.name,
                        className: 'w-24 h-24 object-cover rounded-lg mx-auto'
                    })
                ),

                React.createElement('form', { onSubmit: handleSubmit, className: 'space-y-4' },
                    React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
                        React.createElement('div', null,
                            React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-1' }, 'Product Name'),
                            React.createElement('input', {
                                type: 'text',
                                value: formData.name,
                                onChange: (e) => setFormData({...formData, name: e.target.value}),
                                className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500',
                                required: true
                            })
                        ),
                        React.createElement('div', null,
                            React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-1' }, 'Brand'),
                            React.createElement('input', {
                                type: 'text',
                                value: formData.brand,
                                onChange: (e) => setFormData({...formData, brand: e.target.value}),
                                className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500'
                            })
                        )
                    ),

                    React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
                        React.createElement('div', null,
                            React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-1' }, 'Category'),
                            React.createElement('select', {
                                value: formData.category,
                                onChange: (e) => setFormData({...formData, category: e.target.value}),
                                className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500'
                            },
                                ...categories.map(cat => 
                                    React.createElement('option', { key: cat, value: cat }, cat)
                                )
                            )
                        ),
                        React.createElement('div', null,
                            React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-1' }, 'Expiry Date'),
                            React.createElement('input', {
                                type: 'date',
                                value: formData.expiryDate,
                                onChange: (e) => setFormData({...formData, expiryDate: e.target.value}),
                                className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500'
                            })
                        )
                    ),

                    React.createElement('div', { className: 'grid grid-cols-2 gap-4' },
                        React.createElement('div', null,
                            React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-1' }, 'Quantity'),
                            React.createElement('input', {
                                type: 'number',
                                value: formData.quantity,
                                onChange: (e) => setFormData({...formData, quantity: Number(e.target.value)}),
                                min: '0.1',
                                step: '0.1',
                                className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500',
                                required: true
                            })
                        ),
                        React.createElement('div', null,
                            React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-1' }, 'Unit'),
                            React.createElement('select', {
                                value: formData.unit,
                                onChange: (e) => setFormData({...formData, unit: e.target.value}),
                                className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500'
                            },
                                ...units.map(unit => 
                                    React.createElement('option', { key: unit, value: unit }, unit)
                                )
                            )
                        )
                    ),

                    React.createElement('div', null,
                        React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-1' }, 'Notes (optional)'),
                        React.createElement('textarea', {
                            value: formData.notes,
                            onChange: (e) => setFormData({...formData, notes: e.target.value}),
                            className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500',
                            rows: 2,
                            placeholder: 'Any additional notes...'
                        })
                    ),

                    React.createElement('div', { className: 'flex gap-3 pt-4' },
                        React.createElement('button', {
                            type: 'button',
                            onClick: onCancel,
                            className: 'flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50'
                        }, 'Cancel'),
                        React.createElement('button', {
                            type: 'submit',
                            className: 'flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold'
                        }, 'Add to Pantry')
                    )
                )
            )
        );
    };

    // Pantry Item Component
    const PantryItem = ({ item, onUpdate, onDelete }) => {
        const [showDetails, setShowDetails] = React.useState(false);
        const expiryStatus = getExpiryStatus(item.expiryDate);

        const updateQuantity = (newQuantity) => {
            if (newQuantity <= 0) {
                onDelete(item.id);
            } else {
                onUpdate(item.id, { ...item, quantity: newQuantity });
            }
        };

        return React.createElement('div', { 
            className: `bg-white rounded-xl p-4 border-2 ${
                expiryStatus.status === 'expired' ? 'border-red-200 bg-red-50' :
                expiryStatus.status === 'urgent' ? 'border-yellow-200 bg-yellow-50' :
                'border-gray-200'
            } hover:shadow-md transition-all` 
        },
            React.createElement('div', { className: 'flex items-start justify-between' },
                React.createElement('div', { className: 'flex-1' },
                    React.createElement('div', { className: 'flex items-center gap-3 mb-2' },
                        item.image && React.createElement('img', {
                            src: item.image,
                            alt: item.name,
                            className: 'w-12 h-12 object-cover rounded-lg'
                        }),
                        React.createElement('div', null,
                            React.createElement('h4', { className: 'font-semibold text-gray-800' }, item.name),
                            item.brand && React.createElement('p', { className: 'text-sm text-gray-600' }, item.brand)
                        )
                    ),
                    
                    React.createElement('div', { className: 'flex items-center justify-between' },
                        React.createElement('div', { className: 'flex items-center gap-2' },
                            React.createElement('button', {
                                onClick: () => updateQuantity(item.quantity - 1),
                                className: 'w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center'
                            }, '−'),
                            React.createElement('span', { className: 'font-semibold px-2' }, 
                                `${item.quantity} ${item.unit}`
                            ),
                            React.createElement('button', {
                                onClick: () => updateQuantity(item.quantity + 1),
                                className: 'w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center'
                            }, '+')
                        ),
                        React.createElement('div', { className: 'text-right' },
                            React.createElement('div', { 
                                className: `text-xs px-2 py-1 rounded-full ${
                                    expiryStatus.color === 'red' ? 'bg-red-100 text-red-700' :
                                    expiryStatus.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                                    expiryStatus.color === 'green' ? 'bg-green-100 text-green-700' :
                                    'bg-gray-100 text-gray-700'
                                }` 
                            }, expiryStatus.text),
                            React.createElement('div', { className: 'text-xs text-gray-500 mt-1' }, item.category)
                        )
                    )
                ),
                
                React.createElement('button', {
                    onClick: () => setShowDetails(!showDetails),
                    className: 'text-gray-400 hover:text-gray-600 ml-2'
                }, showDetails ? '⌄' : '⌃')
            ),

            showDetails && React.createElement('div', { className: 'mt-4 pt-4 border-t border-gray-200 space-y-2' },
                item.notes && React.createElement('p', { className: 'text-sm text-gray-600' }, 
                    React.createElement('strong', null, 'Notes: '), item.notes
                ),
                item.purchaseDate && React.createElement('p', { className: 'text-sm text-gray-600' }, 
                    React.createElement('strong', null, 'Added: '), new Date(item.purchaseDate).toLocaleDateString()
                ),
                item.barcode && React.createElement('p', { className: 'text-sm text-gray-600' }, 
                    React.createElement('strong', null, 'Barcode: '), item.barcode
                ),
                React.createElement('button', {
                    onClick: () => onDelete(item.id),
                    className: 'text-red-500 hover:text-red-700 text-sm font-medium'
                }, 'Remove from Pantry')
            )
        );
    };

    // Main Smart Pantry Component
    const SmartPantry = () => {
        const [pantryData, setPantryData] = React.useState(loadPantryData());
        const [showScanner, setShowScanner] = React.useState(false);
        const [showAddForm, setShowAddForm] = React.useState(false);
        const [productData, setProductData] = React.useState(null);
        const [selectedCategory, setSelectedCategory] = React.useState('All');
        const [searchQuery, setSearchQuery] = React.useState('');
        const [loading, setLoading] = React.useState(false);

        React.useEffect(() => {
            savePantryData(pantryData);
        }, [pantryData]);

        const handleBarcodeScan = async (barcode) => {
            setLoading(true);
            try {
                const product = await lookupBarcode(barcode);
                setProductData(product);
                setShowAddForm(true);
                setShowScanner(false);
            } catch (error) {
                console.error('Barcode lookup failed:', error);
                alert('Failed to lookup product. Please try manual entry.');
            } finally {
                setLoading(false);
            }
        };

        const addItem = (item) => {
            setPantryData(prev => ({
                ...prev,
                items: [...prev.items, item]
            }));
            setShowAddForm(false);
            setProductData(null);
        };

        const updateItem = (id, updatedItem) => {
            setPantryData(prev => ({
                ...prev,
                items: prev.items.map(item => item.id === id ? updatedItem : item)
            }));
        };

        const deleteItem = (id) => {
            setPantryData(prev => ({
                ...prev,
                items: prev.items.filter(item => item.id !== id)
            }));
        };

        const filteredItems = pantryData.items.filter(item => {
            const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                item.brand.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });

        const expiringSoon = pantryData.items.filter(item => {
            const days = getDaysUntilExpiry(item.expiryDate);
            return days !== null && days <= 7 && days >= 0;
        });

        const expired = pantryData.items.filter(item => {
            const days = getDaysUntilExpiry(item.expiryDate);
            return days !== null && days < 0;
        });

        return React.createElement('div', { className: 'max-w-6xl mx-auto p-6' },
            // Header
            React.createElement('div', { className: 'bg-orange-500 rounded-xl p-6 mb-6 text-white' },
                React.createElement('h1', { className: 'text-3xl font-bold mb-2' }, 'Smart Pantry'),
                React.createElement('p', { className: 'text-lg opacity-90' }, 'Track your inventory with barcode scanning'),
                
                React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-4 mt-4' },
                    React.createElement('div', { className: 'text-center' },
                        React.createElement('div', { className: 'text-2xl font-bold' }, pantryData.items.length),
                        React.createElement('div', { className: 'text-sm opacity-90' }, 'Total Items')
                    ),
                    React.createElement('div', { className: 'text-center' },
                        React.createElement('div', { className: 'text-2xl font-bold' }, pantryData.categories.length),
                        React.createElement('div', { className: 'text-sm opacity-90' }, 'Categories')
                    ),
                    React.createElement('div', { className: 'text-center' },
                        React.createElement('div', { className: 'text-2xl font-bold text-yellow-200' }, expiringSoon.length),
                        React.createElement('div', { className: 'text-sm opacity-90' }, 'Expiring Soon')
                    ),
                    React.createElement('div', { className: 'text-center' },
                        React.createElement('div', { className: 'text-2xl font-bold text-red-200' }, expired.length),
                        React.createElement('div', { className: 'text-sm opacity-90' }, 'Expired')
                    )
                )
            ),

            // Alerts
            (expiringSoon.length > 0 || expired.length > 0) && React.createElement('div', { className: 'mb-6 space-y-2' },
                expired.length > 0 && React.createElement('div', { className: 'bg-red-100 border border-red-200 rounded-lg p-4' },
                    React.createElement('h3', { className: 'font-bold text-red-800 mb-2' }, '⚠️ Expired Items'),
                    React.createElement('p', { className: 'text-red-700 text-sm' }, 
                        `${expired.length} item(s) have expired: ${expired.map(item => item.name).join(', ')}`
                    )
                ),
                expiringSoon.length > 0 && React.createElement('div', { className: 'bg-yellow-100 border border-yellow-200 rounded-lg p-4' },
                    React.createElement('h3', { className: 'font-bold text-yellow-800 mb-2' }, '🔔 Expiring Soon'),
                    React.createElement('p', { className: 'text-yellow-700 text-sm' }, 
                        `${expiringSoon.length} item(s) expiring within 7 days: ${expiringSoon.map(item => item.name).join(', ')}`
                    )
                )
            ),

            // Action Buttons
            React.createElement('div', { className: 'flex gap-4 mb-6' },
                React.createElement('button', {
                    onClick: () => setShowScanner(true),
                    className: 'flex-1 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2'
                }, 
                    React.createElement('span', { className: 'text-xl' }, '📷'),
                    'Scan Barcode'
                ),
                React.createElement('button', {
                    onClick: () => {
                        setProductData(null);
                        setShowAddForm(true);
                    },
                    className: 'flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2'
                }, 
                    React.createElement('span', { className: 'text-xl' }, '+'),
                    'Add Manually'
                )
            ),

            // Filters
            React.createElement('div', { className: 'bg-white rounded-xl p-4 mb-6 shadow-lg' },
                React.createElement('div', { className: 'flex flex-col md:flex-row gap-4' },
                    React.createElement('input', {
                        type: 'text',
                        placeholder: 'Search items...',
                        value: searchQuery,
                        onChange: (e) => setSearchQuery(e.target.value),
                        className: 'flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500'
                    }),
                    React.createElement('select', {
                        value: selectedCategory,
                        onChange: (e) => setSelectedCategory(e.target.value),
                        className: 'px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500'
                    },
                        React.createElement('option', { value: 'All' }, 'All Categories'),
                        ...pantryData.categories.map(cat => 
                            React.createElement('option', { key: cat, value: cat }, cat)
                        )
                    )
                )
            ),

            // Items Grid
            filteredItems.length === 0 ? 
                React.createElement('div', { className: 'text-center py-12' },
                    React.createElement('div', { className: 'text-6xl mb-4' }, '🛒'),
                    React.createElement('h3', { className: 'text-xl font-semibold text-gray-600 mb-2' }, 'Your pantry is empty'),
                    React.createElement('p', { className: 'text-gray-500' }, 'Start by scanning a barcode or adding items manually')
                ) :
                React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' },
                    ...filteredItems.map(item =>
                        React.createElement(PantryItem, {
                            key: item.id,
                            item: item,
                            onUpdate: updateItem,
                            onDelete: deleteItem
                        })
                    )
                ),

            // Modals
            showScanner && React.createElement(BarcodeScanner, {
                onScan: handleBarcodeScan,
                onClose: () => setShowScanner(false)
            }),

            showAddForm && React.createElement(AddItemForm, {
                productData: productData,
                onAdd: addItem,
                onCancel: () => {
                    setShowAddForm(false);
                    setProductData(null);
                }
            }),

            loading && React.createElement('div', { 
                className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50' 
            },
                React.createElement('div', { className: 'bg-white rounded-xl p-6 text-center' },
                    React.createElement('div', { className: 'animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4' }),
                    React.createElement('p', null, 'Looking up product...')
                )
            )
        );
    };

    // Export for integration
    const renderSmartPantry = (containerId) => {
        const container = document.getElementById(containerId);
        if (container) {
            ReactDOM.render(React.createElement(SmartPantry), container);
        }
    };

    // Make available globally
    window.FuelIQPantry = {
        SmartPantry,
        renderSmartPantry
    };

})();
