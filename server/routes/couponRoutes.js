import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const couponsFilePath = path.join(__dirname, '../../data/coupons.json');

const getCouponsData = () => {
  try {
    const data = fs.readFileSync(couponsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [
      {
        id: "cpn_1",
        code: "FRESH20",
        discountAmount: 50,
        minOrderValue: 199,
        description: "20% OFF up to ₹50 on minimum order of ₹199",
        terms: "Valid on first order only"
      },
      {
        id: "cpn_2",
        code: "GROCERY50",
        discountAmount: 100,
        minOrderValue: 499,
        description: "₹100 OFF on orders above ₹499",
        terms: "Applicable on all grocery items"
      }
    ];
  }
};

// GET /api/coupons - List all available coupons
router.get('/', (req, res) => {
  try {
    const coupons = getCouponsData();
    res.json({ success: true, data: coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch coupons' });
  }
});

// POST /api/coupons/validate - Validate coupon code
router.post('/validate', (req, res) => {
  try {
    const { code, orderAmount = 0 } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required' });
    }

    const coupons = getCouponsData();
    const coupon = coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid coupon code' });
    }

    if (orderAmount < coupon.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Minimum order value of ₹${coupon.minOrderValue} required for coupon ${coupon.code}`,
      });
    }

    res.json({
      success: true,
      message: `Coupon ${coupon.code} applied successfully!`,
      coupon,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to validate coupon' });
  }
});

export default router;
