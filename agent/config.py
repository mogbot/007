"""
Configuration for Agent 007 Autonomous Protocol
"""

import os
from decimal import Decimal
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class Config:
    """Configuration settings for Agent 007."""
    
    # Blockchain Network
    NETWORK = os.getenv('NETWORK', 'mainnet-beta')  # mainnet-beta, devnet, testnet
    RPC_ENDPOINT = os.getenv('RPC_ENDPOINT', 'https://api.mainnet-beta.solana.com')
    
    # Wallet Addresses
    EARNING_WALLET = os.getenv('EARNING_WALLET', '')  # Wallet receiving payments
    BURN_ADDRESS = os.getenv('BURN_ADDRESS', '11111111111111111111111111111111')  # Dead wallet
    TOKEN_ADDRESS = os.getenv('TOKEN_ADDRESS', '')  # $007 token mint address
    PAYMENT_AUTHORITY = os.getenv('PAYMENT_AUTHORITY', '')  # pump.fun payment authority
    
    # Protocol Parameters
    MIN_BUYBACK_THRESHOLD = Decimal(os.getenv('MIN_BUYBACK_THRESHOLD', '0.1'))  # Minimum SOL before buyback
    CHECK_INTERVAL_SECONDS = int(os.getenv('CHECK_INTERVAL_SECONDS', '300'))  # 5 minutes default
    SLIPPAGE_BPS = int(os.getenv('SLIPPAGE_BPS', '100'))  # 1% slippage tolerance
    
    # DEX Configuration
    DEX_PROGRAM_ID = os.getenv('DEX_PROGRAM_ID', '')  # Jupiter aggregator or other DEX
    
    # Safety Parameters
    MAX_BUYBACK_AMOUNT = Decimal(os.getenv('MAX_BUYBACK_AMOUNT', '10'))  # Max SOL per buyback
    ENABLE_SAFETY_CHECKS = os.getenv('ENABLE_SAFETY_CHECKS', 'true').lower() == 'true'
    
    # Logging
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    LOG_FILE = os.getenv('LOG_FILE', 'agent_007.log')
    
    @classmethod
    def validate(cls) -> bool:
        """
        Validate configuration before starting agent.
        
        Returns:
            True if configuration is valid, False otherwise
        """
        errors = []
        
        # Check required wallet addresses
        if not cls.EARNING_WALLET:
            errors.append("EARNING_WALLET not configured")
        
        if not cls.TOKEN_ADDRESS:
            errors.append("TOKEN_ADDRESS not configured")
        
        # Validate numeric parameters
        if cls.MIN_BUYBACK_THRESHOLD <= 0:
            errors.append("MIN_BUYBACK_THRESHOLD must be positive")
        
        if cls.CHECK_INTERVAL_SECONDS < 60:
            errors.append("CHECK_INTERVAL_SECONDS must be at least 60 seconds")
        
        if cls.MAX_BUYBACK_AMOUNT <= cls.MIN_BUYBACK_THRESHOLD:
            errors.append("MAX_BUYBACK_AMOUNT must be greater than MIN_BUYBACK_THRESHOLD")
        
        # Log errors
        if errors:
            print("❌ Configuration errors:")
            for error in errors:
                print(f"   - {error}")
            return False
        
        return True
    
    @classmethod
    def display(cls):
        """Display current configuration (for debugging)."""
        print("🔧 Agent 007 Configuration:")
        print(f"   Network: {cls.NETWORK}")
        print(f"   RPC: {cls.RPC_ENDPOINT}")
        print(f"   Earning Wallet: {cls.EARNING_WALLET[:8]}..." if cls.EARNING_WALLET else "   Earning Wallet: NOT SET")
        print(f"   Token: {cls.TOKEN_ADDRESS[:8]}..." if cls.TOKEN_ADDRESS else "   Token: NOT SET")
        print(f"   Min Buyback: {cls.MIN_BUYBACK_THRESHOLD} SOL")
        print(f"   Check Interval: {cls.CHECK_INTERVAL_SECONDS}s")
        print(f"   Max Buyback: {cls.MAX_BUYBACK_AMOUNT} SOL")
        print(f"   Safety Checks: {'Enabled' if cls.ENABLE_SAFETY_CHECKS else 'Disabled'}")
