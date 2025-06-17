// Enhanced Habbt Smart Pantry Module with Receipt OCR
// Complete rebranded version with beautiful blue-teal design

(function() {
    // Prevent multiple loading
    if (window.HabbtPantry) {
        return;
    }

    // Safe Storage Functions (updated for Habbt with backward compatibility)
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
        const keys = ['habbt_pantry', 'fueliq_pantry']; // Save to both for compatibility
        const dataStr = JSON.stringify(data);
        
        if (isLocalStorageAvailable()) {
            try {
                keys.forEach(key => localStorage.setItem(key, dataStr));
            } catch (e) {
                console.warn('localStorage failed, using memory storage:', e);
                keys.forEach(key => memoryStorage[key] = dataStr);
            }
        } else {
            keys.forEach(key => memoryStorage[key] = dataStr);
        }
    };

    const loadPantryData = () => {
        const keys = ['habbt_pantry', 'fueliq_pantry']; // Try both keys for compatibility
        let data = null;
        
        if (isLocalStorageAvailable()) {
            try {
                for (const key of keys) {
                    data = localStorage.getItem(key);
                    if (data) break;
                }
            } catch (e) {
                console.warn('localStorage failed, using memory storage:', e);
                for (const key of keys) {
                    data = memoryStorage[key];
                    if (data) break;
                }
            }
        } else {
            for (const key of keys) {
                data = memoryStorage[key];
                if (data) break;
            }
        }
        
        return data ? JSON.parse(data) : {
            items: [],
            categories: ['Produce', 'Dairy', 'Meat & Seafood', 'Pantry Staples', 'Frozen', 'Beverages', 'Snacks', 'Other']
        };
    };

    // OCR Processing Functions
    let tesseractWorker = null;

    const initTesseract = async () => {
        if (tesseractWorker) return tesseractWorker;
        
        try {
            // Load Tesseract.js from CDN
            if (!window.Tesseract) {
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/tesseract.js@4.1.1/dist/tesseract.min.js';
                document.head.appendChild(script);
                
                await new Promise((resolve, reject) => {
                    script.onload = resolve;
                    script.onerror = reject;
                });
            }
            
            tesseractWorker = await window.Tesseract.createWorker();
            await tesseractWorker.loadLanguage('eng');
            await tesseractWorker.initialize('eng');
            
            return tesseractWorker;
        } catch (error) {
            console.error('Failed to initialize Tesseract:', error);
            throw new Error('OCR initialization failed');
        }
    };

    const processReceiptImage = async (imageFile) => {
        try {
            const worker = await initTesseract();
            const { data: { text } } = await worker.recognize(imageFile);
            return text;
        } catch (error) {
            console.error('OCR processing failed:', error);
            throw new Error('Failed to read receipt text');
        }
    };

    // Receipt Parsing Functions
    const parseReceiptText = (text) => {
        const lines = text.split('\n').map(line => line.trim()).filter(line => line);
        const items = [];
        
        // Common grocery store patterns
        const itemPatterns = [
            /^(.+?)\s+(\d+\.\d{2})$/,  // Item Name + Price
            /^(.+?)\s+(\d+)\s*@\s*(\d+\.\d{2})\s+(\d+\.\d{2})$/,  // Item + Qty @ Price = Total
            /^(.+?)\s+(\d+\.\d{2})\s*[A-Z]?$/  // Item + Price + Tax code
        ];
        
        // Food item keywords (common grocery items)
        const foodKeywords = [
            'milk', 'bread', 'eggs', 'cheese', 'butter', 'yogurt', 'chicken', 'beef', 'fish',
            'apple', 'banana', 'orange', 'tomato', 'lettuce', 'carrot', 'potato', 'onion',
            'rice', 'pasta', 'cereal', 'flour', 'sugar', 'salt', 'pepper', 'oil', 'vinegar',
            'soup', 'sauce', 'juice', 'water', 'soda', 'coffee', 'tea', 'wine', 'beer'
        ];
        
        // Skip patterns (non-food items)
        const skipPatterns = [
            /total/i, /subtotal/i, /tax/i, /cash/i, /change/i, /card/i, /visa/i, /mastercard/i,
            /receipt/i, /thank you/i, /store/i, /cashier/i, /date/i, /time/i, /\d{4}-\d{2}-\d{2}/,
            /bag fee/i, /bottle deposit/i, /coupon/i, /discount/i
        ];
        
        lines.forEach((line, index) => {
            // Skip obvious non-item lines
            if (skipPatterns.some(pattern => pattern.test(line))) {
                return;
            }
            
            // Try to match item patterns
            for (const pattern of itemPatterns) {
                const match = line.match(pattern);
                if (match) {
                    const itemName = match[1].trim();
                    const price = parseFloat(match[match.length - 1]);
                    
                    // Basic validation
                    if (itemName.length > 2 && price > 0 && price < 100) {
                        // Check if it looks like a food item
                        const isLikelyFood = foodKeywords.some(keyword => 
                            itemName.toLowerCase().includes(keyword)
                        ) || itemName.length > 3; // Assume longer names are products
                        
                        if (isLikelyFood) {
                            items.push({
                                name: cleanItemName(itemName),
                                price: price,
                                rawText: line,
                                confidence: calculateConfidence(itemName, price)
                            });
                        }
                    }
                    break;
                }
            }
        });
        
        // Remove duplicates and sort by confidence
        const uniqueItems = items.filter((item, index, self) => 
            self.findIndex(i => i.name.toLowerCase() === item.name.toLowerCase()) === index
        );
        
        return uniqueItems.sort((a, b) => b.confidence - a.confidence);
    };

    const cleanItemName = (name) => {
        return name
            .replace(/\d+\s*LB\s*@.*/i, '') // Remove weight pricing
            .replace(/\d+\s*CT.*/i, '') // Remove count info
            .replace(/[^\w\s&'-]/g, '') // Remove special chars except common ones
            .replace(/\s+/g, ' ')
            .trim()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const calculateConfidence = (name, price) => {
        let confidence = 50;
        
        // Higher confidence for longer, more descriptive names
        if (name.length > 10) confidence += 20;
        if (name.length > 15) confidence += 10;
        
        // Higher confidence for reasonable prices
        if (price > 0.5 && price < 50) confidence += 20;
        
        // Lower confidence for very short names
        if (name.length < 4) confidence -= 30;
        
        // Higher confidence if name contains multiple words
        if (name.split(' ').length > 1) confidence += 15;
        
        return Math.max(0, Math.min(100, confidence));
    };

    // Barcode API Functions (unchanged)
    const lookupBarcode = async (barcode) => {
        try {
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

    // Receipt Items Review Component with Habbt styling
    const ReceiptItemsReview = ({ items, onConfirm, onCancel }) => {
        const [selectedItems, setSelectedItems] = React.useState(
            items.map(item => ({ ...item, selected: item.confidence > 60 }))
        );

        const toggleItem = (index) => {
            setSelectedItems(prev => prev.map((item, i) => 
                i === index ? { ...item, selected: !item.selected } : item
            ));
        };

        const updateItem = (index, field, value) => {
            setSelectedItems(prev => prev.map((item, i) => 
                i === index ? { ...item, [field]: value } : item
            ));
        };

        const handleConfirm = () => {
            const confirmedItems = selectedItems
                .filter(item => item.selected)
                .map(item => ({
                    name: item.name,
                    category: item.category || 'Other',
                    quantity: 1,
                    unit: 'pcs',
                    price: item.price,
                    notes: `Added from receipt - Original: ${item.rawText}`
                }));
            onConfirm(confirmedItems);
        };

        return React.createElement('div', { 
            className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50' 
        },
            React.createElement('div', { 
                className: 'bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col' 
            },
                React.createElement('div', { className: 'flex justify-between items-center mb-4' },
                    React.createElement('h3', { className: 'text-xl font-bold text-gray-800' }, 
                        `Review Receipt Items (${items.length} found)`
                    ),
                    React.createElement('button', { 
                        onClick: onCancel,
                        className: 'text-gray-500 hover:text-gray-700 text-xl font-bold' 
                    }, '×')
                ),

                React.createElement('div', { className: 'mb-4 p-4 bg-blue-50 rounded-lg' },
                    React.createElement('p', { className: 'text-blue-800 text-sm' },
                        '✨ Review the items we found on your receipt. Check the boxes for items you want to add to your pantry. You can edit names and categories before adding.'
                    )
                ),

                React.createElement('div', { className: 'flex-1 overflow-y-auto mb-4' },
                    React.createElement('div', { className: 'space-y-3' },
                        ...selectedItems.map((item, index) =>
                            React.createElement('div', { 
                                key: index,
                                className: `border rounded-lg p-4 ${item.selected ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`
                            },
                                React.createElement('div', { className: 'flex items-start gap-3' },
                                    React.createElement('input', {
                                        type: 'checkbox',
                                        checked: item.selected,
                                        onChange: () => toggleItem(index),
                                        className: 'mt-1 w-5 h-5 text-blue-600'
                                    }),
                                    React.createElement('div', { className: 'flex-1' },
                                        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-3' },
                                            React.createElement('div', null,
                                                React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Item Name'),
                                                React.createElement('input', {
                                                    type: 'text',
                                                    value: item.name,
                                                    onChange: (e) => updateItem(index, 'name', e.target.value),
                                                    className: 'w-full px-3 py-2 border border-gray-300 rounded-md text-sm',
                                                    disabled: !item.selected
                                                })
                                            ),
                                            React.createElement('div', null,
                                                React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Category'),
                                                React.createElement('select', {
                                                    value: item.category || 'Other',
                                                    onChange: (e) => updateItem(index, 'category', e.target.value),
                                                    className: 'w-full px-3 py-2 border border-gray-300 rounded-md text-sm',
                                                    disabled: !item.selected
                                                },
                                                    ['Produce', 'Dairy', 'Meat & Seafood', 'Pantry Staples', 'Frozen', 'Beverages', 'Snacks', 'Other'].map(cat =>
                                                        React.createElement('option', { key: cat, value: cat }, cat)
                                                    )
                                                )
                                            ),
                                            React.createElement('div', null,
                                                React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Price'),
                                                React.createElement('div', { className: 'text-sm text-gray-600 py-2' }, 
                                                    item.price ? `$${item.price.toFixed(2)}` : 'No price'
                                                )
                                            )
                                        ),
                                        React.createElement('div', { className: 'mt-2 text-xs text-gray-500' },
                                            `Confidence: ${item.confidence}% • Original: "${item.rawText}"`
                                        )
                                    )
                                )
                            )
                        )
                    )
                ),

                React.createElement('div', { className: 'flex gap-3 pt-4 border-t' },
                    React.createElement('button', {
                        onClick: onCancel,
                        className: 'flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50'
                    }, 'Cancel'),
                    React.createElement('button', {
                        onClick: handleConfirm,
                        disabled: selectedItems.filter(item => item.selected).length === 0,
                        className: 'flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 disabled:bg-gray-300 text-white rounded-lg font-semibold'
                    }, `Add ${selectedItems.filter(item => item.selected).length} Items to Pantry`)
                )
            )
        );
    };

    // Enhanced Scanner Component with Habbt styling
    const EnhancedScanner = ({ onScan, onReceiptItems, onClose }) => {
        const [scanMode, setScanMode] = React.useState('barcode'); // 'barcode' or 'receipt'
        const [isScanning, setIsScanning] = React.useState(false);
        const [error, setError] = React.useState('');
        const [manualBarcode, setManualBarcode] = React.useState('');
        const [processing, setProcessing] = React.useState(false);
        const videoRef = React.useRef(null);
        const streamRef = React.useRef(null);
        const fileInputRef = React.useRef(null);

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
                    video: { facingMode: 'environment' }
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

        const capturePhoto = () => {
            if (!videoRef.current) return;
            
            const canvas = document.createElement('canvas');
            const video = videoRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);
            
            canvas.toBlob(async (blob) => {
                if (scanMode === 'receipt') {
                    await processReceiptPhoto(blob);
                } else {
                    // For barcode mode, you'd integrate with a barcode detection library
                    simulateScan();
                }
            }, 'image/jpeg', 0.8);
        };

        const processReceiptPhoto = async (imageBlob) => {
            setProcessing(true);
            try {
                const text = await processReceiptImage(imageBlob);
                const items = parseReceiptText(text);
                
                if (items.length === 0) {
                    setError('No grocery items found on this receipt. Please try a clearer photo.');
                } else {
                    stopCamera();
                    onReceiptItems(items);
                }
            } catch (err) {
                setError('Failed to process receipt. Please try again with a clearer photo.');
            } finally {
                setProcessing(false);
            }
        };

        const handleFileUpload = async (event) => {
            const file = event.target.files[0];
            if (!file) return;
            
            if (scanMode === 'receipt') {
                setProcessing(true);
                try {
                    const text = await processReceiptImage(file);
                    const items = parseReceiptText(text);
                    
                    if (items.length === 0) {
                        setError('No grocery items found on this receipt. Please try a different image.');
                    } else {
                        onReceiptItems(items);
                    }
                } catch (err) {
                    setError('Failed to process receipt. Please try a different image.');
                } finally {
                    setProcessing(false);
                }
            }
        };

        const handleManualEntry = () => {
            if (manualBarcode.trim()) {
                onScan(manualBarcode.trim());
                onClose();
            }
        };

        const simulateScan = () => {
            const mockBarcodes = [
                '0123456789012',
                '0737628064502',
                '0016000275157',
                '0041196891171'
            ];
            const randomBarcode = mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)];
            onScan(randomBarcode);
            onClose();
        };

        return React.createElement('div', { 
            className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50' 
        },
            React.createElement('div', { 
                className: 'bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col' 
            },
                React.createElement('div', { className: 'flex justify-between items-center mb-4' },
                    React.createElement('h3', { className: 'text-xl font-bold text-gray-800' }, 'Smart Scanner'),
                    React.createElement('button', { 
                        onClick: onClose,
                        className: 'text-gray-500 hover:text-gray-700 text-xl font-bold' 
                    }, '×')
                ),

                // Mode Toggle with Habbt colors
                React.createElement('div', { className: 'flex bg-gray-100 rounded-lg p-1 mb-4' },
                    React.createElement('button', {
                        onClick: () => setScanMode('barcode'),
                        className: `flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                            scanMode === 'barcode' 
                                ? 'bg-gradient-to-r from-blue-500 to-teal-600 text-white' 
                                : 'text-gray-600 hover:text-gray-800'
                        }`
                    }, '📷 Barcode'),
                    React.createElement('button', {
                        onClick: () => setScanMode('receipt'),
                        className: `flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                            scanMode === 'receipt' 
                                ? 'bg-gradient-to-r from-blue-500 to-teal-600 text-white' 
                                : 'text-gray-600 hover:text-gray-800'
                        }`
                    }, '🧾 Receipt')
                ),

                // Mode Description
                React.createElement('div', { className: 'mb-4 p-3 bg-blue-50 rounded-lg' },
                    React.createElement('p', { className: 'text-blue-800 text-sm' },
                        scanMode === 'barcode' 
                            ? '📷 Scan individual product barcodes to add items one by one'
                            : '🧾 Capture your grocery receipt to automatically add multiple items at once'
                    )
                ),

                // Camera/Upload Section
                React.createElement('div', { className: 'mb-6' },
                    !isScanning ? 
                        React.createElement('div', { className: 'text-center space-y-3' },
                            React.createElement('div', { className: 'w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4' },
                                React.createElement('span', { className: 'text-4xl' }, scanMode === 'barcode' ? '📷' : '🧾')
                            ),
                            React.createElement('button', {
                                onClick: startCamera,
                                className: 'w-full bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white px-6 py-3 rounded-lg font-semibold mb-2'
                            }, `📷 Start Camera${scanMode === 'receipt' ? ' (Receipt)' : ' (Barcode)'}`),
                            
                            React.createElement('button', {
                                onClick: () => fileInputRef.current?.click(),
                                className: 'w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white px-6 py-3 rounded-lg font-semibold mb-2'
                            }, `📁 Upload ${scanMode === 'receipt' ? 'Receipt' : 'Photo'}`),
                            
                            scanMode === 'barcode' && React.createElement('button', {
                                onClick: simulateScan,
                                className: 'w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold text-sm'
                            }, '🎯 Demo: Random Product'),

                            React.createElement('input', {
                                ref: fileInputRef,
                                type: 'file',
                                accept: 'image/*',
                                onChange: handleFileUpload,
                                className: 'hidden'
                            })
                        ) :
                        React.createElement('div', { className: 'relative' },
                            React.createElement('video', {
                                ref: videoRef,
                                autoPlay: true,
                                playsInline: true,
                                className: 'w-full h-48 bg-black rounded-lg object-cover'
                            }),
                            React.createElement('div', { className: 'absolute inset-0 flex items-center justify-center' },
                                scanMode === 'barcode' 
                                    ? React.createElement('div', { className: 'w-32 h-20 border-2 border-blue-500 rounded-lg' })
                                    : React.createElement('div', { className: 'w-40 h-32 border-2 border-blue-500 rounded-lg border-dashed' })
                            ),
                            React.createElement('div', { className: 'text-center mt-3' },
                                React.createElement('p', { className: 'text-sm text-gray-600 mb-3' }, 
                                    scanMode === 'barcode' ? 'Point camera at barcode' : 'Capture entire receipt'
                                ),
                                React.createElement('div', { className: 'flex gap-2 justify-center' },
                                    React.createElement('button', {
                                        onClick: capturePhoto,
                                        disabled: processing,
                                        className: 'bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg'
                                    }, processing ? 'Processing...' : 'Capture'),
                                    React.createElement('button', {
                                        onClick: stopCamera,
                                        className: 'bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg'
                                    }, 'Stop')
                                )
                            )
                        )
                ),

                processing && React.createElement('div', { className: 'mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg' },
                    React.createElement('div', { className: 'flex items-center gap-3' },
                        React.createElement('div', { className: 'animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500' }),
                        React.createElement('span', { className: 'text-yellow-800' }, 'Processing receipt... This may take a moment.')
                    )
                ),

                error && React.createElement('div', { className: 'bg-red-50 border border-red-200 rounded-lg p-3 mb-4' },
                    React.createElement('p', { className: 'text-red-700 text-sm' }, error)
                ),

                // Manual Entry Section (only for barcode mode)
                scanMode === 'barcode' && React.createElement('div', { className: 'border-t pt-4' },
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
                            className: 'bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg'
                        }, 'Add')
                    )
                )
            )
        );
    };

    // Add Item Form Component with Habbt styling
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
                                className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500',
                                required: true
                            })
                        ),
                        React.createElement('div', null,
                            React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-1' }, 'Brand'),
                            React.createElement('input', {
                                type: 'text',
                                value: formData.brand,
                                onChange: (e) => setFormData({...formData, brand: e.target.value}),
                                className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
                            })
                        )
                    ),

                    React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
                        React.createElement('div', null,
                            React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-1' }, 'Category'),
                            React.createElement('select', {
                                value: formData.category,
                                onChange: (e) => setFormData({...formData, category: e.target.value}),
                                className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
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
                                className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
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
                                className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500',
                                required: true
                            })
                        ),
                        React.createElement('div', null,
                            React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-1' }, 'Unit'),
                            React.createElement('select', {
                                value: formData.unit,
                                onChange: (e) => setFormData({...formData, unit: e.target.value}),
                                className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
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
                            className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500',
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
                            className: 'flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white rounded-lg font-semibold'
                        }, 'Add to Pantry')
                    )
                )
            )
        );
    };

    // Pantry Item Component with Habbt styling
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

    // Main Smart Pantry Component with Habbt branding
    const SmartPantry = () => {
        const [pantryData, setPantryData] = React.useState(loadPantryData());
        const [showScanner, setShowScanner] = React.useState(false);
        const [showAddForm, setShowAddForm] = React.useState(false);
        const [showReceiptReview, setShowReceiptReview] = React.useState(false);
        const [productData, setProductData] = React.useState(null);
        const [receiptItems, setReceiptItems] = React.useState([]);
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

        const handleReceiptItems = (items) => {
            setReceiptItems(items);
            setShowReceiptReview(true);
            setShowScanner(false);
        };

        const addItem = (item) => {
            setPantryData(prev => ({
                ...prev,
                items: [...prev.items, item]
            }));
            setShowAddForm(false);
            setProductData(null);
        };

        const addReceiptItems = (items) => {
            const newItems = items.map(item => ({
                ...item,
                id: Date.now() + Math.random(),
                addedDate: new Date().toISOString(),
                purchaseDate: formatDate(new Date())
            }));

            setPantryData(prev => ({
                ...prev,
                items: [...prev.items, ...newItems]
            }));

            setShowReceiptReview(false);
            setReceiptItems([]);
            
            // Show success message
            alert(`✅ Successfully added ${newItems.length} items to your pantry!`);
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

        return React.createElement('div', { className: 'min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50' },
            React.createElement('div', { className: 'max-w-6xl mx-auto p-6' },
                // Header with Habbt branding
                React.createElement('div', { className: 'bg-gradient-to-r from-blue-600 to-teal-600 rounded-3xl shadow-2xl p-8 mb-8 text-white' },
                    React.createElement('div', { className: 'text-center' },
                        React.createElement('h1', { className: 'text-4xl font-bold mb-2' }, '🏠 Smart Pantry'),
                        React.createElement('p', { className: 'text-xl opacity-90 mb-4' }, 'Organize your inventory with smart tracking habits'),
                        
                        React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-4 mt-6' },
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
                    )
                ),

                // Alerts with Habbt styling
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

                // Action Buttons with Habbt styling
                React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-4 mb-6' },
                    React.createElement('button', {
                        onClick: () => setShowScanner(true),
                        className: 'bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white px-6 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all'
                    }, 
                        React.createElement('span', { className: 'text-xl' }, '🔍'),
                        'Smart Scanner'
                    ),
                    React.createElement('button', {
                        onClick: () => {
                            setProductData(null);
                            setShowAddForm(true);
                        },
                        className: 'bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white px-6 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all'
                    }, 
                        React.createElement('span', { className: 'text-xl' }, '+'),
                        'Add Manually'
                    ),
                    React.createElement('div', { className: 'bg-gradient-to-r from-cyan-100 to-blue-100 border border-cyan-300 rounded-lg p-4 text-center' },
                        React.createElement('div', { className: 'text-2xl mb-1' }, '🧾'),
                        React.createElement('div', { className: 'text-sm font-medium text-cyan-800' }, 'NEW: Receipt Upload!'),
                        React.createElement('div', { className: 'text-xs text-cyan-600' }, 'Scan receipts to add multiple items')
                    )
                ),

                // Filters with Habbt styling
                React.createElement('div', { className: 'bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-6 shadow-lg border border-white/20' },
                    React.createElement('div', { className: 'flex flex-col md:flex-row gap-4' },
                        React.createElement('input', {
                            type: 'text',
                            placeholder: 'Search items...',
                            value: searchQuery,
                            onChange: (e) => setSearchQuery(e.target.value),
                            className: 'flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
                        }),
                        React.createElement('select', {
                            value: selectedCategory,
                            onChange: (e) => setSelectedCategory(e.target.value),
                            className: 'px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
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
                        React.createElement('p', { className: 'text-gray-500' }, 'Start by scanning a barcode, uploading a receipt, or adding items manually')
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
                showScanner && React.createElement(EnhancedScanner, {
                    onScan: handleBarcodeScan,
                    onReceiptItems: handleReceiptItems,
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

                showReceiptReview && React.createElement(ReceiptItemsReview, {
                    items: receiptItems,
                    onConfirm: addReceiptItems,
                    onCancel: () => {
                        setShowReceiptReview(false);
                        setReceiptItems([]);
                    }
                }),

                loading && React.createElement('div', { 
                    className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50' 
                },
                    React.createElement('div', { className: 'bg-white rounded-xl p-6 text-center' },
                        React.createElement('div', { className: 'animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4' }),
                        React.createElement('p', null, 'Processing...')
                    )
                )
            )
        );
    };

    // Export for integration with both Habbt and FuelIQ (backward compatibility)
    const renderSmartPantry = (containerId) => {
        const container = document.getElementById(containerId);
        if (container) {
            ReactDOM.render(React.createElement(SmartPantry), container);
        }
    };

    // Make available globally with both naming conventions
    window.HabbtPantry = {
        SmartPantry,
        renderSmartPantry
    };

    // Backward compatibility
    window.FuelIQPantry = window.HabbtPantry;

    console.log('✅ Habbt Smart Pantry loaded - Complete rebranded version with beautiful blue-teal design');

})();
